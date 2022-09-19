import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { LoRepositoryCreationDto } from './dto/lo-repository-creation.dto';
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

  @Get('learning_objects/:learningObjectId')
  async loadLearningObject(@Param('learningObjectId') learningObjectId: string) {
    return this.loService.loadLearningObject(learningObjectId);
  }
}
