import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { MLSClient } from "../clients/clientService/mlsClient.service";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";

/**
 * Service that manages MLS Events
 * @author Wenzel
 */
@Injectable()
export class EventMgmtService {
    constructor(private learningUnitService: LearningUnitMgmtService) {}

    async getEvent(dto: MLSEvent) {
        switch (dto.entityType) {
            case MlsActionEntity.Task:{
                if (dto.method === MlsActionType.POST) {
                    let locDto: SearchLearningUnitCreationDto = new SearchLearningUnitCreationDto(
                        dto.id,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                    );
                    return this.learningUnitService.createLearningUnit(locDto);
                    
                } else if (dto.method === MlsActionType.PUT) {
                    let client = new MLSClient();

                    let learningUnit = await client.getLearningUnitForId(dto.id);
                    let b = await this.learningUnitService.patchLearningUnit(dto.id, learningUnit);

                    return b;
                } else if (dto.method === MlsActionType.DELETE) {
                    return this.learningUnitService.deleteLearningUnit(dto.id);
                } else {
                    return "error";
                }}
           
            case MlsActionEntity.User:  {
                return new ForbiddenException('not implemented')
            }
            case MlsActionEntity.TaskStep:  {
                break;
            }

            default:
                return new ForbiddenException("MlsActionEntity unknown");
        }
    }
}
