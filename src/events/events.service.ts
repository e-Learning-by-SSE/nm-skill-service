import { ForbiddenException, Injectable } from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { MLSClient } from "../clients/clientService/mlsClient.service";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";

/**
 * Service that manages MLS Events
 * @author Wenzel
 */
@Injectable()
export class EventMgmtService {
    constructor(
        private learningUnitService: LearningUnitMgmtService,
        private userService: UserMgmtService,
    ) {}

    async getEvent(dto: MLSEvent) {
        switch (dto.entityType) {
            case MlsActionEntity.Task: {
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
                }
            }

            case MlsActionEntity.User: {
                if (dto.method === MlsActionType.POST) {
                    let locDto: UserCreationDto = new UserCreationDto(
                        dto.id,
                        null,
                        null,
                        null,
                        null,
                        
                        
                        null,
                        null,
                        null,
                    );
                    return this.userService.createUser(locDto);
                } else if (dto.method === MlsActionType.PUT) {
                    let client = new MLSClient();

                    return new Error("Method not implemented.");
                } else if (dto.method === MlsActionType.DELETE) {
                    return new Error("Method not implemented.");
                } else {
                    return new Error("Method not implemented.");
                }
            }
            case MlsActionEntity.TaskStep: {
                break;
            }

            default:
                return new ForbiddenException("MlsActionEntity unknown");
        }
    }
}
