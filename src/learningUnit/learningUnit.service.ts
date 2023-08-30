import { Injectable } from '@nestjs/common';

import { SearchLearningUnitCreationDto } from './dto';
import { LearningUnitFactory } from './learningUnitFactory';

/**
 * Service that manages the creation/update/deletion of learning units.
 * This class basically relies on the LearningUnitFactory, but may add additional logic in the future.
 * @author El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
@Injectable()
export class LearningUnitMgmtService {
  constructor(private luService: LearningUnitFactory) {}

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

  public async loadAllLearningUnits() {
    return this.luService.loadAllLearningUnits();
  }
}
