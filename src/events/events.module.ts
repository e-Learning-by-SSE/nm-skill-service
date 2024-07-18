import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventMgmtService } from "./events.service";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { UserMgmtService } from "../user/user.service";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";
import { TaskEventService } from "./taskEvents.service";
import { TaskToDoEventService } from "./taskToDoEvents.service";
import { UserEventService } from "./userEvents.service";

@Module({
    controllers: [EventsController],
    providers: [EventMgmtService, UserEventService, TaskEventService, TaskToDoEventService, LearningUnitMgmtService, LearningUnitFactory, UserMgmtService, LearningHistoryService],
    exports: [EventMgmtService],
})

export class EventsModule {}