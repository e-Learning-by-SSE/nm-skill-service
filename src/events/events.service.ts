import { ForbiddenException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { UserMgmtService } from "../user/user.service";
import { USERSTATUS } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import LoggerUtil from "../logger/logger";
import { TaskEventService } from "./taskEvents.service";
import { TaskToDoEventService } from "./taskToDoEvents.service";
import { UserEventService } from "./userEvents.service";

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
        private configService: ConfigService,
        private userService: UserMgmtService,
        private taskEventService: TaskEventService,
        private taskToDoEventService: TaskToDoEventService,
        private userEventService: UserEventService,
    ) {
        // We ensure that all defined environment variables are set, otherwise we use a default value
        this.passingThreshold = this.configService.get("PASSING_THRESHOLD") || 0.5;
    }

    /**
     * Whenever the MLS event system publishes an event, this service is triggered.
     * For User events: Create an empty user, update existing user status (active, inactive), delete existing user (set status to inactive).
     * For Task events: Create an empty learning unit, update existing learning unit, delete existing learning unit.
     * For TaskTodoInfo events: Update the progress (StepProcessed, MaxStepsProcessed) within the learning unit.  When task is finished, update learning unit status to finished, save scored points, update linked user.
     * @param mlsEvent Generic event, contains an entityType (User, Task, TaskTodo, TaskTodoInfo), method (PUT, POST, DELETE), id (in the MLS system), and the object itself as payload
     * @returns Depends on the use case, see the respective methods for more information
     */
    async getEvent(mlsEvent: MLSEvent) {
        //Check if the payload is valid JSON
        if (typeof mlsEvent.payload === "string") {
            LoggerUtil.logInfo("EventService::payloadFix (string)");
            // Try to parse the payload as JSON
            try {
                mlsEvent.payload = JSON.parse(mlsEvent.payload);
                LoggerUtil.logInfo("EventService::payloadFixed");
            } catch (e) {
                LoggerUtil.logInfo("EventService::payloadFix (failed)", { cause: e });
                //We should not continue here
                throw new ForbiddenException("Payload is not a valid JSON object");
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
                //Create a partly empty learning unit with the provided data from MLS (when a task is created in MLS)
                if (mlsEvent.method === MlsActionType.POST) {
                    return await this.taskEventService.handlePOSTEvent(mlsEvent);

                    //Update an existing learning unit when the corresponding task in MLS is changed
                    //Relevant values are: title, description, lifecycle, and creator
                    //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set. Send 409 exception back.
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    return await this.taskEventService.handlePUTEvent(mlsEvent);

                    //Delete an existing learning unit if the corresponding task in MLS is deleted
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return await this.taskEventService.handleDELETEEvent(mlsEvent);

                    //If the method is not implemented, throw an exception
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
                    return await this.userEventService.handlePOSTEvent(mlsEvent);

                    //Change the user profile state when it is changed in MLS
                    //TODO: We could also create a user if it is not in our db, but currently we only get an update when the user should be deleted, so a new creation makes no sense
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    return await this.userEventService.handlePUTEvent(mlsEvent);

                    //This is the same as PUT state to "inactive"
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    LoggerUtil.logInfo("EventService::deleteUser", mlsEvent.id);
                    return this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);

                    // When the method is not implemented
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
                // When a TaskTodoInfo is updated in the MLS system, update our user profile accordingly
                if (mlsEvent.method === MlsActionType.PUT) {
                    //Validates the payload
                    this.checkInput(mlsEvent);

                    //Get the id of the user that updated the task
                    const userID = this.extractId(mlsEvent.taskTodoPayload, "user");
                    const taskID = this.extractId(mlsEvent.taskTodoPayload, "task");

                    return await this.taskToDoEventService.updateLearnedSkills(
                        mlsEvent,
                        userID,
                        taskID,
                        this.passingThreshold,
                    );
                } else {
                    throw new ForbiddenException(
                        "TaskToDoInfoEvent: Method for this action type not implemented.",
                    );
                }
            }

            default:
                LoggerUtil.logInfo("EventService::MlsActionEntityUnknown", mlsEvent.entityType);
                throw new ForbiddenException("MlsActionEntity unknown");
        }
    }

    private checkInput(mlsEvent: MLSEvent) {
        // Make sure taskTodoPayload is existent and not empty
        if (!mlsEvent.taskTodoPayload) {
            LoggerUtil.logInfo(
                "EventService::TaskToDoInfoLearnSkill:Error",
                "taskTodoPayload is empty/undefined!",
            );
            throw new UnprocessableEntityException("TaskTodoPayload is empty/undefined!");
        }

        if (typeof mlsEvent.taskTodoPayload === "string") {
            LoggerUtil.logInfo("EventService::payloadFix (string)");
            // Try to parse the payload as JSON
            try {
                mlsEvent.taskTodoPayload = JSON.parse(mlsEvent.taskTodoPayload);
                LoggerUtil.logInfo("EventService::payloadFixed");
            } catch (e) {
                LoggerUtil.logInfo("EventService::payloadFix (failed)", { cause: e });
                //We should not continue here
                throw new ForbiddenException("TaskTodoPayload is not a valid JSON object");
            }
        }
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

        if (!id) {
            LoggerUtil.logInfo(
                "EventService::TaskToDoInfoLearnSkill:Error",
                `ID for ${key} not found`,
            );
            throw new UnprocessableEntityException(`ID for ${key} not found`);
        }

        return id;
    }
}
