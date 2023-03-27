import { Body, Controller, Get, Param, ParseBoolPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  LearningUnitCreationDto, LearningUnitDto, LearningUnitListDto 
} from './dto';

import { LearningUnitMgmtService } from './learningUnit.service';

@ApiTags('LearningUnit')
@Controller('learningUnits')
export class LearningUnitMgmtController {
  constructor(private learningUnitService: LearningUnitMgmtService) {}

  
  /**
   * Lists all learningUnits.
   
   * @returns List of all learningUnits.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('add_learningUnit')
  addlearningUnit(
   
   
    @Body() dto: LearningUnitCreationDto,
  ) {
    return this.learningUnitService.createLearningUnit(dto);
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
