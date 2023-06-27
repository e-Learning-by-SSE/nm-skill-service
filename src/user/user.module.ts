import { DynamicModule, Module } from '@nestjs/common';

import { UserMgmtController } from './user.controller';
import { UserMgmtService } from './user.service';
import { MODE } from '../config/env.validation';

@Module({})
export class DynamicUserModule {
  static register(): DynamicModule {
    console.log('DynamicUserModule register');
    const controllers = [];
    const providers = [];
    const extension: MODE = <MODE>process.env.EXTENSION;
    switch (extension) {
      case MODE.SEARCH:
        controllers.push(UserMgmtController);
        providers.push(UserMgmtService);
        console.log('Search loaded');
        break;
      case MODE.SELFLEARN:
        console.log('Self-Learn loaded');
        break;
      default:
        throw new Error('No Extension activated, no LearningUnit Controller registered!');
    }
    return {
      module: DynamicUserModule,
      controllers,
      providers,
    };
  }
}
