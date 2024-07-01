import { Injectable } from "@nestjs/common";
import {
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitUpdateDto,
} from "./dto";
import { LearningUnitFactory } from "./learningUnitFactory";
import { LearningUnitFilterDto } from "./dto/learningUnit-filter.dto";

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

    /**
     * Adds a new LearningUnit
     * @param dto Specifies the learningUnit to be created
     * @returns The newly created learningUnit
     */
    async createLearningUnit(dto: SearchLearningUnitCreationDto) {
        return await this.luService.createSearchLearningUnit(dto);
    }

    /**
     * Returns the specified learningUnit.
     * @param learningUnitId The ID of the learningUnit, that shall be returned
     * @returns The DTO representation of the specified learningUnit.
     * @throws NotFoundException If the learning unit does not exist.
     */
    public async getLearningUnit(learningUnitId: string) {
        const dao = await this.luService.loadLearningUnit(learningUnitId);
        return SearchLearningUnitDto.createFromDao(dao);
    }

    public async deleteLearningUnit(learningUnitId: string) {
        return this.luService.deleteLearningUnit(learningUnitId);
    }

    public async loadAllLearningUnits() {
        return this.luService.loadAllLearningUnits();
    }
    public async patchLearningUnit(learningUnitId: string, dto: SearchLearningUnitUpdateDto) {
        return this.luService.patchLearningUnit(dto);
    }
}
