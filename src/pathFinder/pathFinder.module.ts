import { Module } from '@nestjs/common';

import { PathFinderController } from './pathFinder.controller';
import { PathFinderService } from './pathFinder.service';
import { GraphMapper } from './graphMapper.service';
import { DynamicLearningUnitModule } from '../learningUnit/dynamic.module';
import { SkillModule } from '../skills/skill.module';

@Module({
  controllers: [PathFinderController],
  imports: [DynamicLearningUnitModule.register(), SkillModule],
  providers: [PathFinderService, GraphMapper],
})
export class PathFinderModule {}
