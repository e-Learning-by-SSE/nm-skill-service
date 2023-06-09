import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LearningUnitMgmtService } from './learningUnit.service';
import { SelfLearnLearningUnitCreationDto, SelfLearnLearningUnitDto, SelfLearnLearningUnitListDto } from './dto';

@ApiTags('LearningUnit')
@Controller('learningUnits')
export class SelfLearnLearningUnitController {
  constructor(private learningUnitService: LearningUnitMgmtService) {}

  /**
   * Lists all learningUnits.
   
   * @returns List of all learningUnits.
   */
  @Get('showAllLearningUnits')
  listLearningUnits() {
    // Unsafe, does not support Refactoring / Type Checks -> Search for a solution based on TypeGuard
    return this.learningUnitService.loadAllLearningUnits() as Promise<SelfLearnLearningUnitListDto>;
  }

  /**
   * Creates a new learningUnit at the specified repository and returns the created learningUnit.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the learningUnit shall be added to.
   * @param dto The learningUnit description
   * @returns The created learningUnit.
   */
  @Post('add_learningUnit')
  addLearningUnitSelfLearn(@Body() dto: SelfLearnLearningUnitCreationDto) {
    // Unsafe, does not support Refactoring / Type Checks -> Search for a solution based on TypeGuard
    return this.learningUnitService.createLearningUnit(dto) as Promise<SelfLearnLearningUnitDto>;
  }

  /**
   * Returns the specified learningUnit.
   * @param learningUnitId The ID of the learningUnit, that shall be returned
   * @returns The specified learningUnit.
   */
  @Get(':learningUnitId')
  async getLearningUnit(@Param('learningUnitId') learningUnitId: string) {
    // Unsafe, does not support Refactoring / Type Checks -> Search for a solution based on TypeGuard
    const learningUnit = await this.learningUnitService.getLearningUnit(learningUnitId);
    return learningUnit as SelfLearnLearningUnitDto;
  }
}
