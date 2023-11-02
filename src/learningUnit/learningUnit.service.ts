import { Injectable } from "@nestjs/common";

import { SearchLearningUnitCreationDto, SearchLearningUnitDto } from "./dto";
import { LearningUnitFactory } from "./learningUnitFactory";
import { MLSEvent } from "../events/dtos/mls-event.dto";
import { MlsActionEntity } from "../events/dtos/mls-actionEntity.dto";
import { MlsActionType } from "../events/dtos/mls-actionType.dto";
import { MLSClient } from "../clients/clientService/mlsClient.service";
import { LearningUnitFilterDto } from "./dto/search/learningUnit-filter.dto";

/**
 * Service that manages the creation/update/deletion of learning units.
 * This class basically relies on the LearningUnitFactory, but may add additional logic in the future.
 * @author El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
@Injectable()
export class LearningUnitMgmtService {
    constructor(private luService: LearningUnitFactory) {}

    getLearningUnitByFilter(filter: LearningUnitFilterDto) {
      return this.luService.getLearningUnitByFilter(filter);
    }
    checkLearningUnit(learningUnitId: string) {
        throw new Error("Method not implemented.");
    }

    async getEvent(dto: MLSEvent) {
        if (dto.entityType === MlsActionEntity.Task && dto.method === MlsActionType.POST) {
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
            return this.createLearningUnit(locDto);
        } else if (dto.entityType === MlsActionEntity.Task && dto.method === MlsActionType.PUT) {
            let client = new MLSClient();

            let learningUnit = await client.getLearningUnitForId(dto.id);
            let b = await this.patchLearningUnit(dto.id, learningUnit);

            return b;
        } else if (dto.entityType === MlsActionEntity.Task && dto.method === MlsActionType.DELETE) {
            return this.deleteLearningUnit(dto.id);
        } else {
            return "error";
        }
    }

    /**
   * Adds a new LearningUnit
   * @param dto Specifies the learningUnit to be created
   * @returns The newly created learningUnit

   */
    async createLearningUnit(dto: SearchLearningUnitCreationDto) {
        return this.luService.createLearningUnit(dto);
    }

    public async getLearningUnit(learningUnitId: string) {
        return this.luService.getLearningUnit(learningUnitId);
    }
    public async deleteLearningUnit(learningUnitId: string) {
        return this.luService.deleteLearningUnit(learningUnitId);
    }

    public async loadAllLearningUnits() {
        return this.luService.loadAllLearningUnits();
    }
    public async patchLearningUnit(learningUnitId: string, dto: SearchLearningUnitCreationDto) {
        return this.luService.patchLearningUnit(learningUnitId, dto);
    }
}
