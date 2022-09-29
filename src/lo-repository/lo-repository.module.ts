import { Module } from '@nestjs/common';

import { LearningGoalService } from './learning-goal.service';
import { LoRepositoryController } from './lo-repository.controller';
import { LoRepositoryService } from './lo-repository.service';

@Module({
  controllers: [LoRepositoryController],
  providers: [LoRepositoryService, LearningGoalService],
})
export class LoRepositoryModule {}
