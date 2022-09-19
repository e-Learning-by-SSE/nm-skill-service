import { Controller, Get, Param } from '@nestjs/common';

import { LoRepositoryService } from './lo-repository.service';

@Controller('learning_objects')
export class LoRepositoryController {
  constructor(private loService: LoRepositoryService) {}

  @Get()
  listRepositories() {
    return this.loService.listRepositories();
  }

  @Get(':repositoryId')
  async loadRepository(@Param('repositoryId') repositoryId: string) {
    return this.loService.loadRepository(repositoryId);
  }
}
