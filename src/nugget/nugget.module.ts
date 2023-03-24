import { Module } from '@nestjs/common';

import { SkillMgmtController } from './nugget.controller';
import { SkillMgmtService } from './nugget.service';

@Module({
  controllers: [SkillMgmtController],
  providers: [SkillMgmtService],
})
export class SkillModule {}
