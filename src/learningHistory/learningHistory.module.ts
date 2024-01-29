import { Module } from '@nestjs/common';

import { LearningHistoryController } from './learningHistory.controller';
import { LearningHistoryService } from './learningHistory.service';

@Module({
  controllers: [LearningHistoryController],
  providers: [LearningHistoryService],
  exports: [LearningHistoryService],
})
export class LearningHistoryModule {}