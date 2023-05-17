import { DynamicModule, Module } from '@nestjs/common';

import { NuggetMgmtController } from './nugget.controller';
import { NuggetMgmtService } from './nugget.service';
import { MODE } from 'src/config/env.validation';

@Module({})
export class DynamicNuggetModuleModule {
  static register(): DynamicModule {
    console.log('DynamicNuggetModule register');
    const controllers = [];
    const providers = [];
    const extension: MODE = <MODE>process.env.EXTENSION;
    switch (extension) {
      case MODE.SEARCH:
        controllers.push(NuggetMgmtController);
        providers.push(NuggetMgmtService);
        console.log('Search loaded');
        break;
      case MODE.SELFLEARN:
        console.log('Self-Learn loaded');
        break;
      default:
        throw new Error('No Extension activated, no LearningUnit Controller registered!');
    }
    return {
      module: DynamicNuggetModuleModule,
      controllers,
      providers,
    };
  }
}
