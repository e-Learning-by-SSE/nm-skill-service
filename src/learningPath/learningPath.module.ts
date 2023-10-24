import { Module } from '@nestjs/common';

import { LearningPathMgmtController } from './learningPath.controller';
import { LearningPathMgmtService } from './learningPath.service';
import { LearningUnitModule } from 'src/learningUnit/learningUnit.module';

@Module({
  controllers: [LearningPathMgmtController],
  providers: [LearningPathMgmtService],
  imports: [LearningUnitModule]
})
export class LearningPathModule {}
