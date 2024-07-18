import { UnprocessableEntityException } from "@nestjs/common/exceptions/unprocessable-entity.exception";
import LoggerUtil from "../logger/logger";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { MLSEvent } from "./dtos/mls-event.dto";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";


@Injectable()
export class TaskToDoEventService {

    constructor(
        private learningHistoryService: LearningHistoryService
    ) {}



async updateLearnedSkills(mlsEvent: MLSEvent, userID: string, taskID: string, passingThreshold: number) {
    //Try to read the required values.
    //If field not existing or not a number, variables will be NaN or undefined and the condition evaluates to false (the ! is necessary to force typescript to access the object, though)
    const scoredPoints = +mlsEvent.taskTodoPayload!["scoredPoints" as keyof JSON]; //The + is used for parsing to a number
    const maxPoints = +mlsEvent.taskTodoPayload!["maxPoints" as keyof JSON]; // caution: can be 0
    const STATUS = mlsEvent.payload["status" as keyof JSON];


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
}