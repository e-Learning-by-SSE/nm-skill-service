import { Module } from '@nestjs/common';

import { LoRepositoryController } from './lo-repository.controller';
import { LoRepositoryService } from './lo-repository.service';

@Module({
  controllers: [LoRepositoryController],
  providers: [LoRepositoryService],
})
export class LoRepositoryModule {}
