import { Module } from '@nestjs/common';

import { LearningUnitMgmtController } from './learningUnit.controller';
import { LearningUnitMgmtService } from './learningUnit.service';

@Module({
  controllers: [LearningUnitMgmtController],
  providers: [LearningUnitMgmtService],
})
export class LearningUnitModule {}
