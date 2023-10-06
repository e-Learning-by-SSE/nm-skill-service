import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SearchLearningUnitCreationDto } from './dto/search';

import { LearningUnitMgmtService } from './learningUnit.service';
import { MLSEvent } from '../events/dtos/mls-event.dto';

@ApiTags('LearningUnit')
@Controller('learningUnits')
export class SearchLearningUnitController {
  constructor(private learningUnitService: LearningUnitMgmtService) {}

  /**
   * Lists all learningUnits.
   
   * @returns List of all learningUnits.
   */
  @Get('showAllLearningUnits')
  listLearningUnits() {
    return this.learningUnitService.loadAllLearningUnits();
  }

  /**
   * Creates a new learningUnit at the specified repository and returns the created learningUnit.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the learningUnit shall be added to.
   * @param dto The learningUnit description
   * @returns The created learningUnit.
   */
  @Post('add_learningUnit')
  addLearningUnitSearch(@Body() dto: SearchLearningUnitCreationDto) {
    return this.learningUnitService.createLearningUnit(dto);
  }
  @Post('events/')
  getEvents(@Body() dto: MLSEvent) {
    return this.learningUnitService.getEvent(dto);
  }

  /**
   * Returns the specified learningUnit.
   * @param learningUnitId The ID of the learningUnit, that shall be returned
   * @returns The specified learningUnit.
   */
  @Get(':learningUnitId')
  getLearningUnit(@Param('learningUnitId') learningUnitId: string) {
    return this.learningUnitService.getLearningUnit(learningUnitId);
  }
  @Delete(':learningUnitId')
  deleteLearningUnit(@Param('learningUnitId') learningUnitId: string) {
    return this.learningUnitService.deleteLearningUnit(learningUnitId);
  }
}
