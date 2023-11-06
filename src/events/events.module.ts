import { Module } from '@nestjs/common';

import { EventsController} from './events.controller';
import { EventMgmtService } from './events.service';
import { LearningUnitMgmtService } from '../learningUnit/learningUnit.service';
import { LearningUnitFactory } from '../learningUnit/learningUnitFactory';

@Module({
  
  controllers: [EventsController],
  providers: [EventMgmtService, LearningUnitMgmtService, LearningUnitFactory],
  exports: [EventMgmtService],
})
export class EventsModule {}
