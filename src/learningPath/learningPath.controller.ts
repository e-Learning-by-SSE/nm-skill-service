import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { LearningPathCreationDto } from './dto';

import { LearningPathMgmtService } from './learningPath.service';

@ApiTags('LearningPath')
@Controller('learningpaths')
export class LearningPathMgmtController {
  constructor(private learningpathService: LearningPathMgmtService) {}

  /**
   * Lists all learning paths.
   
   * @returns List of all learning paths.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('showAllLearningPaths')
  listLearningPaths() {
    return this.learningpathService.loadAllLearningPaths();
  }

  /**
   * Creates a new learningpath at the specified repository and returns the created learningpath.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the learningpath shall be added to.
   * @param dto The learningpath description
   * @returns The created learningpath.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('add_learningpath')
  addLearningpath(@Body() dto: LearningPathCreationDto) {
    return this.learningpathService.createLearningPath(dto);
  }

  /**
   * Returns the specified learningpath.
   * @param learningpathId The ID of the learningpath, that shall be returned
   * @returns The specified learningpath.
   */
  @Get(':learningpathId')
  getLearningPath(@Param('learningpathId') learningpathId: string) {
    return this.learningpathService.getLearningPath(learningpathId);
  }
}
