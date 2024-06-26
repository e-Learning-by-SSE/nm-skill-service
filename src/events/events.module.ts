import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventMgmtService } from "./events.service";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { UserMgmtService } from "../user/user.service";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";

@Module({
    controllers: [EventsController],
    providers: [EventMgmtService, LearningUnitMgmtService, LearningUnitFactory, UserMgmtService, LearningHistoryService],
    exports: [EventMgmtService],
})

export class EventsModule {}