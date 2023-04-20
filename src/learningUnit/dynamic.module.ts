import { DynamicModule, Module } from '@nestjs/common';

import { LearningUnitMgmtService } from './learningUnit.service';
import { LearningUnitFactory } from './LearningUnitFactory';
import { SelfLearnLearningUnitController } from './learningUnit.selflearn.controller';
import { SearchLearningUnitController } from './learningUnit.search.controller';

@Module({})
export class DynamicLearningUnitModule {
  static register(): DynamicModule {
    console.log('DynamicLearningUnitModule register');
    const controllers = [];
    if (process.env.EXTENSION_SEARCH === 'true') {
      console.log('Search loaded');
      controllers.push(SearchLearningUnitController);
    } else if (process.env.EXTENSION_SELF_LEARN === 'true') {
      console.log('Self-Learn loaded');
      controllers.push(SelfLearnLearningUnitController);
    } else {
      console.log('Warning: No Extension activated, no LearningUnit Controller registered!');
    }
    return {
      module: DynamicLearningUnitModule,
      controllers,
      providers: [LearningUnitMgmtService, LearningUnitFactory],
    };
  }
}
