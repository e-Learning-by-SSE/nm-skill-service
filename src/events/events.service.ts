import { ForbiddenException, Injectable } from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";
import { USERSTATUS, LIFECYCLE } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

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
                //Create a partly empty learning unit with the provided id from MLS (when a task is created in MLS)
                if (mlsEvent.method === MlsActionType.POST) {
                    const learningUnitDto: SearchLearningUnitCreationDto = {
                        id: mlsEvent.id,
                        title: mlsEvent.payload["title" as keyof JSON]?.toString(), //Only convert to string if not undefined or null
                        description: mlsEvent.payload["description" as keyof JSON]?.toString(),
                        contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
                        teachingGoals: [], //Initially empty
                        requiredSkills: [], //Initially empty
                        lifecycle: LIFECYCLE.DRAFT, //Initially as draft
                    };

                    return this.learningUnitService.createLearningUnit(learningUnitDto);

                    //Update an existing learning unit when the corresponding task in MLS is changed
                    //Relevant values are: title, description, lifecycle, and creator
                    //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set. Send 409 exception back.
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    //Lifecycle needs extra handling (save content of JSON as string if key exists)
                    const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();
                    //Match string to enum. Can result in undefined. Enum matching is case sensitive.
                    const lifecycle: LIFECYCLE =
                        LIFECYCLE[lifecycleString as keyof typeof LIFECYCLE];

                    //TODO: Do we want to notify if any of the values is undefined or cannot be matched?
                    //Further: Do we want to create non-existing learning units for which we get an update?

                    //Gets id, title, description, lifecycle, and creator from the MLS system
                    //Caution: A PUT may contain just a partial update, some values may be undefined
                    const learningUnitDto: SearchLearningUnitCreationDto = {
                        id: mlsEvent.id,
                        title: mlsEvent.payload["title" as keyof JSON]?.toString(), //Only convert to string if not undefined or null
                        description: mlsEvent.payload["description" as keyof JSON]?.toString(),
                        contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
                        teachingGoals: [], //ToDo: How do we handle these? Who is updating them?
                        requiredSkills: [], //ToDo: How do we handle these? Who is updating them?
                        lifecycle: lifecycle,
                    };

                    console.log(learningUnitDto);

                    //Update the existing learning unit in our system with the new values from MLS
                    const learningUnit = await this.learningUnitService.patchLearningUnit(
                        mlsEvent.id,
                        learningUnitDto,
                    );

                    console.log(learningUnit);

                    return learningUnit;

                    //Delete an existing learning unit if the corresponding task in MLS is deleted
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    //Check that we only delete if lifecycle is draft
                    const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();

                    //This works only if we really get the whole object with the DELETE event
                    if (lifecycleString == "DRAFT") {
                        return this.learningUnitService.deleteLearningUnit(mlsEvent.id);
                    } else {
                        throw new ForbiddenException(
                            "TaskEvent: Cannot delete a task that is not in DRAFT mode. Currently: " +
                                lifecycleString,
                        );
                    }
                } else {
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
                    const userDto: UserCreationDto = {
                        id: mlsEvent.id,
                        name: mlsEvent.payload["name" as keyof JSON]?.toString(),
                        status: USERSTATUS.ACTIVE, //Initially, users are created as active users
                    };

                    return this.userService.createUser(userDto);

                    //Change the user profile state when it is changed in MLS
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    //Try to read the state attribute of the user
                    const userState = mlsEvent.payload["state" as keyof JSON];

                    //Check if we got a valid result (MLS uses a boolean) and change the user state accordingly
                    if (userState != undefined) {
                        if (userState == "true") {
                            return await this.userService.patchUserState(
                                mlsEvent.id,
                                USERSTATUS.ACTIVE,
                            );
                        } else if (userState == "false") {
                            return await this.userService.patchUserState(
                                mlsEvent.id,
                                USERSTATUS.INACTIVE,
                            );
                        } else {
                            throw new ForbiddenException(
                                "UserEvent: Unknown state attribute value " +
                                    userState +
                                    " from MLS user entity. Update aborted.",
                            );
                        }
                    } else {
                        throw new ForbiddenException(
                            "UserEvent: Could not read the state attribute from MLS user entity. Update aborted.",
                        );
                    }

                    //This is the same as PUT state to "inactive"
                    //TODO: Specification does not mention a delete action. Talk with Eugen about what should happen here.
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);
                } else {
                    throw new ForbiddenException(
                        "UserEvent: Method for this action type (" +
                            mlsEvent.method +
                            ") not implemented.",
                    );
                }
            }

            // A MLS teacher adds a MLS user ID to a Task (specifically to its taskTodos array), meaning the user has to complete this task
            // A taskTodo object contains the individual learning progress per user
            //TODO: There is no equivalent in this system? Relation to learning history? Wait until user profile is finished.
            case MlsActionEntity.TaskToDo: {
                // When a TaskTodo is updated in the MLS system, update our user profile accordingly
                // Currently only when TaskTodo is finished? To update our learning history?
                if (mlsEvent.method === MlsActionType.PUT) {
                    // Reaction: From TaskToDo get:
                    /* task, (IRI)
                    user, (IRI)
                    TaskToDoInfo.status, (==FINISHED)
                    scoredPoints,
                    maxPoints
                    --> Update user profile: if (FINISHED && scorePoints/maxPoints >= 0.5) {skill is considered to be acquired} */

                    //What is changed during a put event? We do not get the user or the points during the put event! This is only received with the get event for the tasktodo
                    //TaskToDoInfo: status
                    const tdti = {
                        status: "string",
                        stepsProcessed: 0,
                        lockingStepsProcessed: 0,
                        maxStepsProcessed: 0,
                        lockAfterStep: ["string"],
                        dueTime: 0,
                        reactivatedStartTime: "2024-01-17T09:56:29.862Z",
                        note: "string",
                    };
                    //TaskToDo: task
                    const ttd = {
                        task: "string",
                        taskTodoInfo: {
                            lockAfterStep: ["string"],
                            dueTime: 0,
                            reactivatedStartTime: "2024-01-17T09:56:29.907Z",
                            note: "string",
                        },
                        //...
                        reactivated: true,
                        archived: true,
                        showToLearners: true,
                        showInStatistic: true,
                        //...
                        notice: "string",
                        equipmentMaintenance: "string",
                        weightedPercents: 0,
                        deselectedForms: ["string"],
                    };

                    //We don't have a taskToDo DTO, this should be done in the learning history
                    //const taskToDo = await this.taskToDoService.patchTaskToDo(mlsEvent.id, taskTodoDto);

                    return "Nothing changed yet";
                } else {
                    throw new ForbiddenException(
                        "TaskToDoEvent: Method for this action type not implemented.",
                    );
                }
            }

            //TODO: What about taskTodoInfo? It is existing in the Excel table, but not in Miro
            case MlsActionEntity.TaskToDoInfo: {
                break;
            }

            default:
                throw new ForbiddenException("MlsActionEntity unknown");
        }
    }
}
