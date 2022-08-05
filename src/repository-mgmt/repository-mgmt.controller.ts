import { GetUser } from 'src/auth/decorator';

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
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
}
