import e from 'express';

import { Body, Controller, Get, HttpException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { LearningObjectCreationDto } from './dto/learning-object-creation.dto';
import { LearningObjectModificationDto } from './dto/learning-object-modification.dto';
import { LoRepositoryCreationDto } from './dto/lo-repository-creation.dto';
import { LoRepositoryModifyDto } from './dto/lo-repository-modify.dto';
import { LoRepositoryService } from './lo-repository.service';

@ApiTags('Learning Objects')
@Controller('lo_repository')
export class LoRepositoryController {
  constructor(private loService: LoRepositoryService) {}

  @Get()
  listRepositories() {
    return this.loService.listRepositories();
  }

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async createRepository(@GetUser('id') userId: string, @Body() dto: LoRepositoryCreationDto) {
    return this.loService.createNewRepository(userId, dto);
  }

  @Get(':repositoryId')
  async loadRepository(@Param('repositoryId') repositoryId: string) {
    return this.loService.loadRepository(repositoryId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':repositoryId')
  async modifyRepository(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: LoRepositoryModifyDto,
  ) {
    try {
      return await this.loService.modifyRepository(userId, repositoryId, dto);
    } catch (error) {
      if (error instanceof RangeError) {
        // Not an internal error (500) but wrong user input (422)
        throw new HttpException(error.message, 422);
      }
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':repositoryId/add_learning_object')
  async createLearningObject(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: LearningObjectCreationDto,
  ) {
    return this.loService.createLearningObject(userId, repositoryId, dto);
  }

  @Get('learning_objects/:learningObjectId')
  async loadLearningObject(@Param('learningObjectId') learningObjectId: string) {
    return this.loService.loadLearningObject(learningObjectId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':repositoryId/:learningObjectId')
  async modifyLearningObject(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Param('learningObjectId') learningObjectId: string,
    @Body() dto: LearningObjectModificationDto,
  ) {
    try {
      return await this.loService.modifyLearningObject(userId, repositoryId, learningObjectId, dto);
    } catch (error) {
      if (error instanceof RangeError) {
        // Not an internal error (500) but wrong user input (422)
        throw new HttpException(error.message, 422);
      }
      throw error;
    }
  }
}
