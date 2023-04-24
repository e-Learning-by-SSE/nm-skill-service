import { Module } from '@nestjs/common';

import { LearningPathMgmtController } from './learningPath.controller';
import { LearningPathMgmtService } from './learningPath.service';

@Module({
  controllers: [LearningPathMgmtController],
  providers: [LearningPathMgmtService],
})
export class LearningPathModule {}
