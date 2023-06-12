import { DynamicModule, Module } from '@nestjs/common';

import { LearningUnitMgmtService } from './learningUnit.service';
import { LearningUnitFactory } from './learningUnitFactory';
import { SelfLearnLearningUnitController } from './learningUnit.selflearn.controller';
import { SearchLearningUnitController } from './learningUnit.search.controller';
import { MODE } from '../config/env.validation';

@Module({})
export class DynamicLearningUnitModule {
  static register(): DynamicModule {
    return DynamicLearningUnitModule.registerByConfiguration(<MODE>process.env.EXTENSION);
  }

  static registerByConfiguration(extension: MODE): DynamicModule {
    console.log('DynamicLearningUnitModule register');
    const controllers = [];
    switch (extension) {
      case MODE.SEARCH:
        console.log('Search loaded');
        controllers.push(SearchLearningUnitController);
        break;
      case MODE.SELFLEARN:
        console.log('Self-Learn loaded');
        controllers.push(SelfLearnLearningUnitController);
        break;
      default:
        throw new Error('No Extension activated, no LearningUnit Controller registered!');
    }
    return {
      module: DynamicLearningUnitModule,
      controllers,
      providers: [LearningUnitMgmtService, LearningUnitFactory],
      exports: [LearningUnitMgmtService, LearningUnitFactory],
    };
  }
}
