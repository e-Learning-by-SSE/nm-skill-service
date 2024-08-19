import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { MLSEvent } from "./dtos/mls-event.dto";
import { LIFECYCLE } from "@prisma/client";
import { SearchLearningUnitUpdateDto, SearchLearningUnitCreationDto } from "../learningUnit/dto";
import LoggerUtil from "../logger/logger";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UnprocessableEntityException } from "@nestjs/common";
import { MlsActionType } from "./dtos";

@Injectable()
export class TaskEventService {
    constructor(private learningUnitService: LearningUnitMgmtService) {}

    /**
     * Handles events for MLS tasks
     * @param mlsEvent The event to handle, contains information about the learning unit to update (or create).
     * @returns Depends on the case, see the respective methods for more information
     */
    async handleTaskEvent(mlsEvent: MLSEvent) {
        //Create a partly empty learning unit with the provided data from MLS (when a task is created in MLS)
        if (mlsEvent.method === MlsActionType.POST) {
            return await this.handlePOSTEvent(mlsEvent);

            //Update an existing learning unit when the corresponding task in MLS is changed
            //Relevant values are: title, description, lifecycle, and creator
            //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set. Send 409 exception back.
        } else if (mlsEvent.method === MlsActionType.PUT) {
            return await this.handlePUTEvent(mlsEvent);

            //Delete an existing learning unit if the corresponding task in MLS is deleted
        } else if (mlsEvent.method === MlsActionType.DELETE) {
            return await this.handleDELETEEvent(mlsEvent);

            //If the method is not implemented, throw an exception
        } else {
            LoggerUtil.logInfo("EventService::unknownTaskEventMethod", mlsEvent.method);
            throw new ForbiddenException(
                "TaskEvent: Method for this action type (" + mlsEvent.method + ") not implemented.",
            );
        }
    }

    /**
     * Handles POST events for MLS tasks (creates a new learning unit with the same id as in the MLS system)
     * @param mlsEvent Contains information about the learning unit to create.
     * @returns The newly created learning unit
     */
    async handlePOSTEvent(mlsEvent: MLSEvent) {
        const learningUnit = await this.learningUnitService.createLearningUnit(
            await this.createLearningUnitCreationDTOFromMLSEvent(mlsEvent),
        );
        LoggerUtil.logInfo("EventService::createLearningUnit", learningUnit);
        return learningUnit;
    }

    /**
     * Handles PUT events for MLS tasks (updates the learning unit or creates a new one if not existing).
     * @param mlsEvent The event to handle, contains information about the learning unit to update.
     * @returns The updated or newly created learning unit
     */
    async handlePUTEvent(mlsEvent: MLSEvent) {
        //Declare required objects
        let learningUnit;
        const learningUnitUpdateDTO = await this.createLearningUnitUpdateDTOFromMLSEvent(mlsEvent);

        //Then try to either update the learning unit, or create a new one if not existent
        try {
            //Update the existing learning unit in our system with the new values from MLS
            learningUnit = await this.learningUnitService.patchLearningUnit(
                mlsEvent.id,
                learningUnitUpdateDTO,
            );
            LoggerUtil.logInfo("EventService::updateLearningUnit(updateResult)", learningUnit);
        } catch (exception) {
            if (exception instanceof NotFoundException) {
                //Create a new learning unit in our system with the new values from MLS (this can happen if we missed a post request)
                learningUnit = await this.learningUnitService.createLearningUnit(
                    await this.createLearningUnitCreationDTOFromMLSEvent(mlsEvent),
                );
                LoggerUtil.logInfo(
                    "EventService::updateLearningUnit(createNewLearningUnit)",
                    learningUnit,
                );
            } else {
                throw new UnprocessableEntityException("Could not update or create learning unit.");
            }
        }
        return learningUnit;
    }

    /**
     * Handles DELETE events for MLS tasks (deletes the learning unit).
     * @param mlsEvent Contains information about the learning unit to delete.
     * @returns A success message if the learning unit was deleted.
     */
    async handleDELETEEvent(mlsEvent: MLSEvent) {
        //Get the lifecycle attribute
        const lifecycle: LIFECYCLE = await this.getLifecycleAttribute(mlsEvent);

        //Only delete if the lifecycle is DRAFT
        if (lifecycle == LIFECYCLE.DRAFT) {
            LoggerUtil.logInfo("EventService::deleteLearningUnit(delete)", mlsEvent.id);
            return this.learningUnitService.deleteLearningUnit(mlsEvent.id);
        } else {
            LoggerUtil.logInfo("EventService::deleteLearningUnit(deleteError)", mlsEvent.id);
            throw new ForbiddenException(
                "TaskEvent: Cannot delete a task that is not in DRAFT mode. Currently: " +
                    lifecycle,
            );
        }
    }

    /**
     * Helper function to create a learning unit update DTO from the values of a MLS event.
     * @param mlsEvent Must contain at least the id, can also contain contentCreator as payload.
     * @returns The newly created learning unit DTO
     */
    async createLearningUnitUpdateDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Get the lifecycle attribute
        const lifecycle: LIFECYCLE = await this.getLifecycleAttribute(mlsEvent);

        //Gets id and creator from the MLS system
        //Caution: An event may contain just a partial update, some values may be undefined
        //Following values will be updated later by the SEARCH extension and MUST be undefined: requiredSkills, teachingGoals, targetAudience
        const learningUnitDto: SearchLearningUnitUpdateDto = {
            id: mlsEvent.id,
            contentCreator: mlsEvent.payload["creator" as keyof JSON]?.toString(),
            lifecycle: lifecycle,
        };

        LoggerUtil.logInfo("EventService::LearningUnit(createDTO)", learningUnitDto);

        return learningUnitDto;
    }

    /**
     * Helper function to create a (new) learning unit DTO from the values of a MLS event.
     * @param mlsEvent Must contain at least the id, can also contain title, description, and contentCreator as payload.
     * @returns The newly created learning unit DTO
     */
    async createLearningUnitCreationDTOFromMLSEvent(mlsEvent: MLSEvent) {
        //Get the lifecycle attribute
        const lifecycle: LIFECYCLE = await this.getLifecycleAttribute(mlsEvent);

        //Gets id and creator from the MLS system
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

        LoggerUtil.logInfo("EventService::LearningUnit(createDTO)", learningUnitDto);

        return learningUnitDto;
    }

    /** Helper function to get the lifecycle attribute from the payload of a MLS event.
     * @param mlsEvent The event to extract the lifecycle from
     * @returns The lifecycle attribute as enum
     **/
    async getLifecycleAttribute(mlsEvent: MLSEvent) {
        //Lifecycle needs extra handling (save content of JSON as string if key exists)
        const lifecycleString = mlsEvent.payload["lifecycle" as keyof JSON]?.toString();
        //Match string to enum. Can result in undefined. Enum matching is case sensitive.
        const lifecycle: LIFECYCLE = LIFECYCLE[lifecycleString as keyof typeof LIFECYCLE];

        LoggerUtil.logInfo("EventService::LearningUnit(getLifecycle)", lifecycle);

        return lifecycle;
    }
}
