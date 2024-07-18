import { ForbiddenException, Injectable } from "@nestjs/common";
import { MLSEvent, MlsActionEntity } from "./dtos";
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
    constructor(
        private taskEventService: TaskEventService,
        private taskToDoEventService: TaskToDoEventService,
        private userEventService: UserEventService,
    ) {}

    /**
     * Whenever the MLS event system publishes an event, this service is triggered.
     * For User events: Create an empty user, update existing user status (active, inactive), delete existing user (set status to inactive).
     * For Task events: Create an empty learning unit, update existing learning unit, delete existing learning unit.
     * For TaskTodoInfo events: Update the progress (StepProcessed, MaxStepsProcessed) within the learning unit.  When task is finished, update learning unit status to finished, save scored points, update linked user.
     * @param mlsEvent Generic event, contains an entityType (User, Task, TaskTodo, TaskTodoInfo), method (PUT, POST, DELETE), id (in the MLS system), and the object itself as payload
     * @returns Depends on the use case, see the respective methods for more information
     */
    async getEvent(mlsEvent: MLSEvent) {
        LoggerUtil.logInfo("EventService Event received", {
            entity: mlsEvent.entityType,
            id: mlsEvent.id,
            method: mlsEvent.method,
            payload: mlsEvent.payload,
        });

        //Check if the payload is valid JSON
        await this.checkPayload(mlsEvent);

        //Handle the event based on the entity type
        switch (mlsEvent.entityType) {
            //MLS tasks are called learning units in this system
            case MlsActionEntity.Task: {
                return await this.taskEventService.handleTaskEvent(mlsEvent);
            }

            //MLS users are only available as user profiles in this system
            case MlsActionEntity.User: {
                return await this.userEventService.handleUserEvent(mlsEvent);
            }

            //Connection of tasks and users
            case MlsActionEntity.TaskToDoInfo: {
                return await this.taskToDoEventService.handleTaskTodoInfoEvent(mlsEvent);
            }

            default:
                LoggerUtil.logInfo("EventService::MlsActionEntityUnknown", mlsEvent.entityType);
                throw new ForbiddenException("MlsActionEntity unknown");
        }
    }

    private async checkPayload(mlsEvent: MLSEvent) {
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
    }
}
