import { UnprocessableEntityException } from "@nestjs/common/exceptions/unprocessable-entity.exception";
import LoggerUtil from "../logger/logger";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { MLSEvent } from "./dtos/mls-event.dto";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";
import { ForbiddenException } from "@nestjs/common";
import { MlsActionType } from "./dtos";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Injectable()
export class TaskToDoEventService {
    // The threshold for passing a test
    private passingThreshold: number;

    constructor(
        private configService: ConfigService,
        private learningHistoryService: LearningHistoryService,
    ) {
        // We ensure that all defined environment variables are set, otherwise we use a default value
        this.passingThreshold = this.configService.get("PASSING_THRESHOLD") || 0.5;
    }

    /**
     * Handles events for MLS taskTodoInfo objects
     * A MLS teacher adds a MLS user ID to a Task (specifically to its taskToDos array), meaning the user has to complete this task
     * A taskTodo object contains the individual learning progress per user (and a taskTodoInfo object)
     * A taskTodoInfo contains even more fine-grained updates of the learning progress.
     * We need to listen to taskTodoInfo PUT events, as the change of the status to FINISHED is happening only there
     * We get a payload for the taskTodoInfo, and a taskTodoPayload for the payload of the taskTodo object (due to MLS implementation constraints)
     * @param mlsEvent The event to handle, contains information about the taskTodoInfo object to process
     * @returns Depends on the case, see the respective methods for more information
     */
    async handleTaskTodoInfoEvent(mlsEvent: MLSEvent) {
        // When a TaskTodoInfo is updated in the MLS system, update our user profile accordingly
        if (mlsEvent.method === MlsActionType.PUT) {
            //Validates the payload
            await this.checkInput(mlsEvent);

            //Get the id of the user that updated the task
            const userID = await this.extractId(mlsEvent.taskTodoPayload, "user");
            const taskID = await this.extractId(mlsEvent.taskTodoPayload, "task");

            return await this.updateLearnedSkills(mlsEvent, userID, taskID, this.passingThreshold);
        } else {
            throw new ForbiddenException(
                "TaskToDoInfoEvent: Method for this action type not implemented.",
            );
        }
    }

    /**
     * Updates the learned skills and the learningHistory of a user
     * @param mlsEvent The event which triggered the update, requires payload and taskTodoPayload
     * @param userID The id of the user whose learningHistory should be updated
     * @param taskID The id of the task that triggered the update
     * @param passingThreshold Numeral value for passing a task (and acquiring its skill)
     * @returns Depends on the case, if everything goes well a success message
     */
    private async updateLearnedSkills(
        mlsEvent: MLSEvent,
        userID: string,
        taskID: string,
        passingThreshold: number,
    ) {
        //Try to read the required values.
        //If field not existing or not a number, variables will be NaN or undefined and the condition evaluates to false (the ! is necessary to force typescript to access the object, though)
        const scoredPoints = +mlsEvent.taskTodoPayload!["scoredPoints" as keyof JSON]; //The + is used for parsing to a number
        const maxPoints = +mlsEvent.taskTodoPayload!["maxPoints" as keyof JSON]; // caution: can be 0
        const STATUS = mlsEvent.payload["status" as keyof JSON];

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
                scoredPoints / maxPoints >= passingThreshold)
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

    private async checkInput(mlsEvent: MLSEvent) {
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

    private async extractId(payload: JSON | undefined, key: string) {
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
