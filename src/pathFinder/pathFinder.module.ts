import { Module } from '@nestjs/common';

import { PathFinderController } from './pathFinder.controller';
import { PathFinderService } from './pathFinder.service';
import { SkillMgmtService } from 'src/skills/skill.service';
import { LearningUnitMgmtService } from 'src/learningUnit/learningUnit.service';
import { LearningUnitFactory } from 'src/learningUnit/learningUnitFactory';


@Module({
  controllers: [PathFinderController],
  providers: [PathFinderService, SkillMgmtService, LearningUnitMgmtService,LearningUnitFactory],
})
export class PathFinderModule {}