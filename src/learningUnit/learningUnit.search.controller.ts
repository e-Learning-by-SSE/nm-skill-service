import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SearchLearningUnitCreationDto, SearchLearningUnitDto } from './dto/search';

import { LearningUnitMgmtService } from './learningUnit.service';

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
    // Unsafe, does not support Refactoring / Type Checks -> Search for a solution based on TypeGuard
    return this.learningUnitService.createLearningUnit(dto) as Promise<SearchLearningUnitDto>;
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
}
