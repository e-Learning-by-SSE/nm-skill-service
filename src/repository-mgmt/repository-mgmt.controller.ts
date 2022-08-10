import { GetUser } from 'src/auth/decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { RepositoryCreationDto } from './dto';
import { RepositoryMgmtService } from './repository-mgmt.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('repository-mgmt')
export class RepositoryMgmtController {
  constructor(private repositoryService: RepositoryMgmtService) {}

  @Get('list_repositories')
  listRepositories(@GetUser('id') userId: string) {
    return this.repositoryService.listRepositories(userId);
  }

  @Post('create')
  createRepository(@GetUser('id') userId: string, @Body() dto: RepositoryCreationDto) {
    return this.repositoryService.createRepository(userId, dto);
  }
}
