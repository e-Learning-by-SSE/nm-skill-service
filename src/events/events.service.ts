import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { SearchLearningUnitCreationDto, SearchLearningUnitUpdateDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";
import { USERSTATUS, LIFECYCLE } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import LoggerUtil from "../logger/logger";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";

/**
 * Triggers actions when certain events related to tasks (like creating a TaskTodo) occur in the MLS system
 * Currently, needs a subscription in the MLS system (via the GUI).
 * Receives the complete object as message body.
 * @author Wenzel, Gerling
 */
@Injectable()
export class EventMgmtService {
    // The threshold for passing a test
    private passingThreshold: number;

    constructor(
        private learningUnitService: LearningUnitMgmtService,
        private configService: ConfigService,
        private userService: UserMgmtService,
        private learningHistoryService: LearningHistoryService,
    ) {
        // We ensure that all defined environment variables are set, otherwise we use a default value
        this.passingThreshold = this.configService.get("PASSING_THRESHOLD") || 0.5;
    }

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
        if (typeof mlsEvent.payload === "string") {
            LoggerUtil.logInfo("EventService::payloadFix (string)");
            // Try to parse the payload as JSON
            try {
                mlsEvent.payload = JSON.parse(mlsEvent.payload);
                LoggerUtil.logInfo("EventService::payloadFixed");
            } catch (e) {
                LoggerUtil.logInfo("EventService::payloadFix (failed)", { cause: e });
            }
        }

        LoggerUtil.logInfo("EventService Event received", {
            entity: mlsEvent.entityType,
            id: mlsEvent.id,
            method: mlsEvent.method,
            payload: mlsEvent.payload,
        });

        switch (mlsEvent.entityType) {
            //MLS tasks are called learning units in this system
            case MlsActionEntity.Task: {
                LoggerUtil.logInfo("EventService::Task", {
                    id: mlsEvent.id,
                    method: mlsEvent.method,
                });

                //Create a partly empty learning unit with the provided data from MLS (when a task is created in MLS)
                if (mlsEvent.method === MlsActionType.POST) {
                    const learningUnit = this.learningUnitService.createLearningUnit(
                        this.createLearningUnitCreationDTOFromMLSEvent(mlsEvent),
                    );
                    LoggerUtil.logInfo("EventService::createLearningUnit", learningUnit);
                    return learningUnit;

                    //Update an existing learning unit when the corresponding task in MLS is changed
                    //Relevant values are: title, description, lifecycle, and creator
                    //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set. Send 409 exception back.
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    //Declare required objects
                    let learningUnit;
                    const learningUnitDTO = this.createLearningUnitUpdateDTOFromMLSEvent(mlsEvent);

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
                            learningUnit = this.learningUnitService.createLearningUnit(
                                this.createLearningUnitCreationDTOFromMLSEvent(mlsEvent),
                            );
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
                LoggerUtil.logInfo("EventService::User", {
                    id: mlsEvent.id,
                    method: mlsEvent.method,
                });

                //Create a new empty user profile when a user is created in the MLS system
                if (mlsEvent.method === MlsActionType.POST) {
                    //Create DTO
                    const userDto: UserCreationDto = {
                        id: mlsEvent.id,
                        //Initially, users are created as active users. They only become inactive when deleted.
                    };
                    LoggerUtil.logInfo("EventService::createUserDTO", mlsEvent.id);

                    //Create user profile in database
                    await this.userService.createUser(userDto);
                    LoggerUtil.logInfo("EventService::createUser", userDto);

                    return "User created successfully!";

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
                        if (userState == "1" || userState.toString() == "true") {
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
                                    await this.userService.createUser({ id: mlsEvent.id });

                                    console.log(
                                        "Created new user profile instead of update: " +
                                            mlsEvent.id,
                                    );
                                    LoggerUtil.logInfo(
                                        "EventService::updateUserActive(createNewUserProfile)",
                                        mlsEvent.id,
                                    );
                                } else {
                                    throw new ForbiddenException(
                                        "Update of user profile: " +
                                            mlsEvent.id +
                                            " was aborted due to unknown reasons",
                                    );
                                }
                            }

                            return "Successfully updated user profile!";

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
                LoggerUtil.logInfo("EventService::TaskToDoInfo", {
                    id: mlsEvent.id,
                    method: mlsEvent.method,
                });

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

                    if (typeof mlsEvent.taskTodoPayload === "string") {
                        LoggerUtil.logInfo("EventService::payloadFix (string)");
                        // Try to parse the payload as JSON
                        try {
                            mlsEvent.taskTodoPayload = JSON.parse(mlsEvent.taskTodoPayload);
                            LoggerUtil.logInfo("EventService::payloadFixed");
                        } catch (e) {
                            LoggerUtil.logInfo("EventService::payloadFix (failed)", { cause: e });
                        }
                    }

                    return await this.updateLearnedSkills(mlsEvent);
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
    createLearningUnitUpdateDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Lifecycle needs extra handling (save content of JSON as string if key exists)
        const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();
        //Match string to enum. Can result in undefined. Enum matching is case sensitive.
        const lifecycle: LIFECYCLE = LIFECYCLE[lifecycleString as keyof typeof LIFECYCLE];

        LoggerUtil.logInfo("EventService::LearningUnit(getLifecycle)", lifecycle);

        //Gets id, title, description, lifecycle, and creator from the MLS system
        //Caution: An event may contain just a partial update, some values may be undefined
        //Following values will be updated later by the SEARCH extension and MUST be undefined: requiredSkills, teachingGoals, targetAudience
        const learningUnitDto: SearchLearningUnitUpdateDto = {
            id: mlsEvent.id,
            contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
            lifecycle: lifecycle,
        };

        console.log("Created LU DTO: " + learningUnitDto);
        LoggerUtil.logInfo("EventService::LearningUnit(createDTO)", learningUnitDto);

        return learningUnitDto;
    }

    /**
     * Helper function to create a learning unit DTO from the values of a MLS event.
     * @param mlsEvent Must contain at least the id, can also contain title, description, and contentCreator as payload.
     * @returns The newly created learning unit DTO
     */
    createLearningUnitCreationDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Lifecycle needs extra handling (save content of JSON as string if key exists)
        const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();
        //Match string to enum. Can result in undefined. Enum matching is case sensitive.
        const lifecycle: LIFECYCLE = LIFECYCLE[lifecycleString as keyof typeof LIFECYCLE];

        LoggerUtil.logInfo("EventService::LearningUnit(getLifecycle)", lifecycle);

        //Gets id, title, description, lifecycle, and creator from the MLS system
        //Caution: An event may contain just a partial update, some values may be undefined
        //Following values will be updated later by the SEARCH extension and should be empty: requiredSkills, teachingGoals, targetAudience
        const learningUnitDto: SearchLearningUnitCreationDto = {
            id: mlsEvent.id,
            contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
            lifecycle: lifecycle,
            requiredSkills: [],
            teachingGoals: [],
            targetAudience: [],
        };

        console.log("Created LU DTO: " + learningUnitDto);
        LoggerUtil.logInfo("EventService::LearningUnit(createDTO)", learningUnitDto);

        return learningUnitDto;
    }

    private extractId(payload: JSON | undefined, key: string) {
        let id = undefined;
        if (payload) {
            id = "" + payload[key as keyof JSON]?.toString();
            if (id.includes("/")) {
                // IDs may be transmitted as IRI/URI, extract ID (part after last /)
                const parts = id.split("/");
                id = parts[parts.length - 1];
            }
        }

        return id;
    }

    async updateLearnedSkills(mlsEvent: MLSEvent) {
        //Try to read the required values.
        //If field not existing or not a number, variables will be NaN or undefined and the condition evaluates to false (the ! is necessary to force typescript to access the object, though)
        const scoredPoints = +mlsEvent.taskTodoPayload!["scoredPoints" as keyof JSON]; //The + is used for parsing to a number
        const maxPoints = +mlsEvent.taskTodoPayload!["maxPoints" as keyof JSON]; // caution: can be 0
        const STATUS = mlsEvent.payload["status" as keyof JSON];
        //Get the id of the user that updated the task
        const userID = this.extractId(mlsEvent.taskTodoPayload, "user");
        const taskID = this.extractId(mlsEvent.taskTodoPayload, "task");

        if (!userID || !taskID) {
            LoggerUtil.logInfo(
                "EventService::TaskToDoInfoLearnSkill:Error",
                `User "${userID}" or task "${taskID}" ID not found`,
            );
            throw new UnprocessableEntityException(
                `User "${userID}" or task "${taskID}" ID not found`,
            );
        }

        LoggerUtil.logInfo(
            "EventService::TaskToDoInfoLearnSkill:getIDs",
            "User: " + userID + " Task: " + taskID,
        );

        LoggerUtil.logInfo(
            "EventService::getTaskToDoInfo:PointsAndStatus",
            "scored(" + scoredPoints + ") max(" + maxPoints + ") status(" + STATUS + ")",
        );

        // If the user has started the task
        if (STATUS == "IN_PROGRESS") {
            LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill: Task started", taskID);
            return await this.learningHistoryService.updateLearningUnitInstanceAndPersonalizedPathStatus(
                userID,
                taskID,
                STATUS,
            );
        }

        //Check conditions for acquisition
        if (
            STATUS == "FINISHED" &&
            (maxPoints == 0 || //Because some tasks have no points and are finished successfully every time
                scoredPoints / maxPoints >= this.passingThreshold)
        ) {
            LoggerUtil.logInfo(
                "EventService::TaskToDoInfoLearnSkill: Threshold passed",
                mlsEvent.id,
            );

            //Update the learned skills of the user
            await this.learningHistoryService.updateLearnedSkills(userID, taskID);

            //Update the status of the learning unit instances and the personalized learning paths
            await this.learningHistoryService.updateLearningUnitInstanceAndPersonalizedPathStatus(
                userID,
                taskID,
                STATUS,
            );

            return "Update of status and learned skills finished";
        }

        //When we get irrelevant events, like an unsuccessful attempt to finish a task
        LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill:NothingRelevant", mlsEvent.id);
        return "Nothing relevant happened";
    }
}
