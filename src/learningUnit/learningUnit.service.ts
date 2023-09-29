import { Injectable } from '@nestjs/common';

import { SearchLearningUnitCreationDto } from './dto';
import { LearningUnitFactory } from './learningUnitFactory';
import { MLSEvent } from '../events/dtos/mls-event.dto';
import { MlsActionEntity } from 'src/events/dtos/mls-actionEntity.dto';
import { MlsActionType } from 'src/events/dtos/mls-actionType.dto';

/**
 * Service that manages the creation/update/deletion of learning units.
 * This class basically relies on the LearningUnitFactory, but may add additional logic in the future.
 * @author El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
@Injectable()
export class LearningUnitMgmtService {
  async getEvent(dto: MLSEvent) {
    if(dto.entityType === MlsActionEntity.LearningUnit && dto.method === MlsActionType.PUT){
      
      let  locDto : SearchLearningUnitCreationDto = new SearchLearningUnitCreationDto(dto.id, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
      return this.createLearningUnit(locDto)
       
    }
  }
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
