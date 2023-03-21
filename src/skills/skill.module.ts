import { Module } from '@nestjs/common';

import { SkillMgmtController } from './skill.controller';
import { SkillMgmtService } from './skill.service';

@Module({
  controllers: [SkillMgmtController],
  providers: [SkillMgmtService],
})
export class SkillModule {}
