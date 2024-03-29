import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";
import { USERSTATUS, LIFECYCLE } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import LoggerUtil from "../logger/logger";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";

/**
 * Triggers actions when certain events related to tasks (like creating a TaskTodo) occur in the MLS system
 * Currently, needs a subscription in the MLS system (via the GUI).
 * Receives the complete object as message body.
 * @author Wenzel, Gerling
 */
@Injectable()
export class EventMgmtService {
    constructor(
        private learningUnitService: LearningUnitMgmtService,
        private learningUnitFactory: LearningUnitFactory,
        private userService: UserMgmtService,
        private configService: ConfigService,
    ) {}

    /**
     * Whenever the MLS event system publishes an event, this service is triggered.
     * For User events: Create an empty user, update existing user status (active, inactive), delete existing user (set status to inactive).
     * For Task events: Create an empty learning unit, update existing learning unit, delete existing learning unit.
     * For TaskTodo events: When task is finished, update learning unit status to finished, save scored points, update linked user.
     * For TaskTodoInfo events: Update the progress (StepProcessed, MaxStepsProcessed) within the learning unit.
     * @param mlsEvent Generic event, contains an entityType (User, Task, TaskTodo, TaskTodoInfo), method (PUT, POST, DELETE), id (in the MLS system), and the object itself as payload
     * @returns Depends on the use case?
     */
    async getEvent(mlsEvent: MLSEvent) {
        switch (mlsEvent.entityType) {
            //MLS tasks are called learning units in this system
            case MlsActionEntity.Task: {
                //Create a partly empty learning unit with the provided data from MLS (when a task is created in MLS)
                if (mlsEvent.method === MlsActionType.POST) {
                    const learningUnit = this.learningUnitService.createLearningUnit(
                        await this.createLearningUnitDTOFromMLSEvent(mlsEvent),
                    );
                    LoggerUtil.logInfo("EventService::createLearningUnit", learningUnit);
                    return learningUnit;

                    //Update an existing learning unit when the corresponding task in MLS is changed
                    //Relevant values are: title, description, lifecycle, and creator
                    //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set. Send 409 exception back.
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    //Declare required objects
                    let learningUnit;
                    const learningUnitDTO = await this.createLearningUnitDTOFromMLSEvent(mlsEvent);

                    //Then try to either update the learning unit, or create a new one if not existent
                    try {
                        //Update the existing learning unit in our system with the new values from MLS
                        learningUnit = await this.learningUnitService.patchLearningUnit(
                            mlsEvent.id,
                            learningUnitDTO,
                        );
                        console.log("Updated LU: " + learningUnit);
                        LoggerUtil.logInfo(
                            "EventService::updateLearningUnit(updateResult)",
                            learningUnit,
                        );
                    } catch (exception) {
                        if (exception instanceof NotFoundException) {
                            //Create a new learning unit in our system with the new values from MLS (this can happen if we missed a post request)
                            learningUnit =
                                this.learningUnitService.createLearningUnit(learningUnitDTO);
                            console.log("Created new LU instead of update: " + learningUnit);
                            LoggerUtil.logInfo(
                                "EventService::updateLearningUnit(createNewLearningUnit)",
                                learningUnit,
                            );
                        } else {
                            throw new ForbiddenException(
                                "Update of learning unit: " +
                                    mlsEvent.id +
                                    " was aborted due to unknown reasons",
                            );
                        }
                    }

                    return learningUnit;

                    //Delete an existing learning unit if the corresponding task in MLS is deleted
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    //Check that we only delete if lifecycle is draft
                    const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();

                    LoggerUtil.logInfo(
                        "EventService::deleteLearningUnit(getLifecycle)",
                        lifecycleString,
                    );

                    //This works only if we really get the whole object with the DELETE event
                    if (lifecycleString == "DRAFT" || lifecycleString == "draft") {
                        LoggerUtil.logInfo("EventService::deleteLearningUnit(delete)", mlsEvent.id);
                        return this.learningUnitService.deleteLearningUnit(mlsEvent.id);
                    } else {
                        LoggerUtil.logInfo(
                            "EventService::deleteLearningUnit(deleteError)",
                            mlsEvent.id,
                        );
                        throw new ForbiddenException(
                            "TaskEvent: Cannot delete a task that is not in DRAFT mode. Currently: " +
                                lifecycleString,
                        );
                    }
                } else {
                    LoggerUtil.logInfo("EventService::unknownTaskEventMethod", mlsEvent.method);
                    throw new ForbiddenException(
                        "TaskEvent: Method for this action type (" +
                            mlsEvent.method +
                            ") not implemented.",
                    );
                }
            }

            //MLS users are only available as user profiles in this system
            case MlsActionEntity.User: {
                //Create a new empty user profile when a user is created in the MLS system
                if (mlsEvent.method === MlsActionType.POST) {
                    return await this.createUserProfileDTOFromMLSEvent(mlsEvent);

                    //Change the user profile state when it is changed in MLS
                    //TODO: We could also create a user if it is not in our db, but currently we only get an update when the user should be deleted, so a new creation makes no sense
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    //Try to read the state attribute of the user
                    const userState = mlsEvent.payload["state" as keyof JSON];
                    //Declare required object
                    let userProfile;

                    //Check if we got a valid result (MLS uses a boolean, which is parsed to a number) and change the user state accordingly
                    if (userState != undefined) {
                        //This case can happen if we manually import users from MLS via the respective button (this will trigger PUT events instead of POST)
                        if (userState == "1" || userState == "true") {
                            LoggerUtil.logInfo("EventService::updateUserActive", userState);

                            //Then try to either update the user profile, or create a new one if not existent
                            try {
                                //Update the existing learning unit in our system with the new values from MLS
                                userProfile = await this.userService.patchUserState(
                                    mlsEvent.id,
                                    USERSTATUS.ACTIVE,
                                );
                                console.log("Updated user: " + userProfile);
                                LoggerUtil.logInfo(
                                    "EventService::updateUserActive(updateResult)",
                                    userProfile,
                                );

                                //When the user profile is not in our database
                            } catch (exception) {
                                if (exception instanceof ForbiddenException) {
                                    //TODO Change to NotFound?

                                    //Create a new user profile in our system with the new values from MLS (this can happen if we missed a post request or the update is manually triggered by MLS)
                                    userProfile = this.createUserProfileDTOFromMLSEvent(mlsEvent);

                                    console.log(
                                        "Created new user profile instead of update: " +
                                            userProfile,
                                    );
                                    LoggerUtil.logInfo(
                                        "EventService::updateUserActive(createNewUserProfile)",
                                        userProfile,
                                    );
                                } else {
                                    throw new ForbiddenException(
                                        "Update of user profile: " +
                                            mlsEvent.id +
                                            " was aborted due to unknown reasons",
                                    );
                                }
                            }

                            return userProfile;

                            //This is the same as the DELETE event
                        } else if (userState == "0" || userState == "false") {
                            LoggerUtil.logInfo("EventService::updateUserInactive", userState);
                            return await this.userService.patchUserState(
                                mlsEvent.id,
                                USERSTATUS.INACTIVE,
                            );
                        } else {
                            LoggerUtil.logInfo("EventService::updateUserFailed", userState);
                            throw new ForbiddenException(
                                "UserEvent: Unknown state attribute value " +
                                    userState +
                                    " from MLS user entity. Update aborted.",
                            );
                        }
                    } else {
                        LoggerUtil.logInfo("EventService::updateUserFailed", userState);
                        throw new ForbiddenException(
                            "UserEvent: Could not read the state attribute from MLS user entity. Update aborted.",
                        );
                    }

                    //This is the same as PUT state to "inactive"
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    LoggerUtil.logInfo("EventService::deleteUser", mlsEvent.id);
                    return this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);
                } else {
                    LoggerUtil.logInfo("EventService::deleteUserFailed", mlsEvent.id);
                    throw new ForbiddenException(
                        "UserEvent: Method for this action type (" +
                            mlsEvent.method +
                            ") not implemented.",
                    );
                }
            }

            // A MLS teacher adds a MLS user ID to a Task (specifically to its taskToDos array), meaning the user has to complete this task
            // A taskTodo object contains the individual learning progress per user (and a taskTodoInfo object)
            // A taskTodoInfo contains even more fine-grained updates of the learning progress.
            // We need to listen to taskTodoInfo PUT events, as the change of the status to FINISHED is happening only there
            // We get a payload for the taskTodoInfo, and a taskTodoPayload for the payload of the taskTodo object (due to MLS implementation constraints)
            case MlsActionEntity.TaskToDoInfo: {
                LoggerUtil.logInfo("EventService::TaskToDoInfoEvent", mlsEvent.id);
                // When a TaskTodoInfo is updated in the MLS system, update our user profile accordingly
                if (mlsEvent.method === MlsActionType.PUT) {
                    LoggerUtil.logInfo("EventService::getTaskToDoInfoPUT", mlsEvent.id);

                    // Make sure taskTodoPayload is existent and not empty
                    if (!mlsEvent.taskTodoPayload) {
                        LoggerUtil.logInfo(
                            "EventService::TaskToDoInfoLearnSkill:Error",
                            "taskTodoPayload is empty/undefined!",
                        );
                        throw new UnprocessableEntityException(
                            "TaskTodoPayload is empty/undefined!",
                        );
                    }

                    //Try to read the required values.
                    //If field not existing or not a number, variables will be NaN or undefined and the condition evaluates to false (the ! is necessary to force typescript to access the object, though)
                    const scoredPoints = +mlsEvent.taskTodoPayload!["scoredPoints" as keyof JSON]; //The + is used for parsing to a number
                    const maxPoints = +mlsEvent.taskTodoPayload!["maxPoints" as keyof JSON]; // caution: can be 0
                    const FINISHED = mlsEvent.payload["status" as keyof JSON];

                    LoggerUtil.logInfo(
                        "EventService::getTaskToDoInfo:PointsAndStatus",
                        "scored(" +
                            scoredPoints +
                            ") max(" +
                            maxPoints +
                            ") status(" +
                            FINISHED +
                            ")",
                    );

                    //Check conditions for acquisition
                    if (
                        FINISHED == "FINISHED" &&
                        (maxPoints == 0 || //Because some tasks have no points and are finished successfully every time
                            scoredPoints / maxPoints >= this.configService.get("PASSING_THRESHOLD"))
                    ) {
                        LoggerUtil.logInfo(
                            "EventService::TaskToDoInfoLearnSkill: Threshold passed",
                            mlsEvent.id,
                        );

                        //Get the id of the user that finished the task
                        const userID =
                            "" + mlsEvent.taskTodoPayload!["user" as keyof JSON]?.toString();
                        //Get the id of the finished task
                        const taskID =
                            "" + mlsEvent.taskTodoPayload!["task" as keyof JSON]?.toString();

                        LoggerUtil.logInfo(
                            "EventService::TaskToDoInfoLearnSkill:getIDs",
                            "User: " + userID + " Task: " + taskID,
                        );

                        try {
                            //Load the learning unit (MLS task equivalent) from our DB
                            const lu = await this.learningUnitFactory.loadLearningUnit(taskID);
                            //Get the skills taught by the learning unit
                            const skills = lu.teachingGoals;

                            LoggerUtil.logInfo(
                                "EventService::TaskToDoInfoGetSkill",
                                "LU: " + lu.toString() + " Skills: " + skills.toString(),
                            );

                            // Collect the learned skills matched with the user
                            let learningProgressList = [];

                            //Iterate over all skills taught by the learning unit
                            for (const skill of skills) {
                                //Create a new learning progress entry (that matches user and skill and saves the date of the acquisition)
                                let learningProgressDto =
                                    await this.userService.createProgressForUserId(
                                        userID,
                                        skill.id,
                                    );

                                //Add the progress entry to the result list
                                learningProgressList.push(learningProgressDto);

                                LoggerUtil.logInfo(
                                    "EventService::TaskToDoInfoLearnSkill:SkillAcquired",
                                    learningProgressDto.userId +
                                        "," +
                                        learningProgressDto.skillId +
                                        ")",
                                );
                            }

                            LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill:Finished");

                            //Return the array with all learned skills (list of learning progress objects)
                            return learningProgressList;

                            //When user, learning unit, or skill id are not existent in our DB
                        } catch (error) {
                            console.error(error);
                            LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill:Error", error);
                            throw new ForbiddenException(
                                "No skill(s) acquired, learning unit not existent or has no skills",
                            );
                        }

                        //When we get irrelevant events, like an unsuccessful attempt
                    } else {
                        LoggerUtil.logInfo(
                            "EventService::TaskToDoInfoLearnSkill:NothingRelevant",
                            mlsEvent.id,
                        );
                        return "Nothing relevant happened";
                    }
                } else {
                    throw new ForbiddenException(
                        "TaskToDoInfoEvent: Method for this action type not implemented.",
                    );
                }
            }

            //We do not handle taskToDo events, as they contain taskToDoInfo objects (and the last update is only for the taskToDoInfo object)
            case MlsActionEntity.TaskToDo: {
                LoggerUtil.logInfo("EventService::TaskToDoNotRelevant", mlsEvent.id);
                break;
            }

            default:
                LoggerUtil.logInfo("EventService::MlsActionEntityUnknown", mlsEvent.entityType);
                throw new ForbiddenException("MlsActionEntity unknown");
        }
    }

    /**
     * Helper function to create a learning unit DTO from the values of a MLS event.
     * @param mlsEvent Must contain at least the id, can also contain title, description, and contentCreator as payload.
     * @returns The newly created learning unit DTO
     */
    async createLearningUnitDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Lifecycle needs extra handling (save content of JSON as string if key exists)
        const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();
        //Match string to enum. Can result in undefined. Enum matching is case sensitive.
        const lifecycle: LIFECYCLE = LIFECYCLE[lifecycleString as keyof typeof LIFECYCLE];

        LoggerUtil.logInfo("EventService::LearningUnit(getLifecycle)", lifecycle);

        //Gets id, title, description, lifecycle, and creator from the MLS system
        //Caution: An event may contain just a partial update, some values may be undefined
        const learningUnitDto: SearchLearningUnitCreationDto = {
            id: mlsEvent.id,
            title: mlsEvent.payload["title" as keyof JSON]?.toString(), //Only convert to string if not undefined or null
            description: mlsEvent.payload["description" as keyof JSON]?.toString(),
            contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
            teachingGoals: [], // Skills are created by the SEARCH extension AFTER the learning unit was created
            requiredSkills: [], // Skills are created by the SEARCH extension AFTER the learning unit was created
            targetAudience: [], // Audience is set by the SEARCH extension AFTER the learning unit was created
            lifecycle: lifecycle,
        };

        console.log("Created LU DTO: " + learningUnitDto);
        LoggerUtil.logInfo("EventService::LearningUnit(createDTO)", learningUnitDto);

        return learningUnitDto;
    }

    /**
     * Helper function to create a user profile DTO from the values of a MLS event.
     * @param mlsEvent Must contain at least the id, can also contain title, description, and contentCreator as payload.
     * @returns The newly created learning user creation DTO
     */
    async createUserProfileDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Create DTO
        const userDto: UserCreationDto = {
            id: mlsEvent.id,
            name: mlsEvent.payload["name" as keyof JSON]?.toString(),
            status: USERSTATUS.ACTIVE, //Initially, users are created as active users. They only become inactive when deleted.
        };
        LoggerUtil.logInfo("EventService::createUserDTO", userDto);

        //Create user profile in database
        const user = this.userService.createUser(userDto);
        LoggerUtil.logInfo("EventService::createUser", user);

        return user;
    }
}
