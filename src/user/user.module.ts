import { Module } from "@nestjs/common";

import { UserMgmtController } from "./user.controller";
import { UserMgmtService } from "./user.service";
import { CareerProfileService } from "./careerProfile.service";
import { LearningHistoryService } from "./learningHistory.service";

@Module({
    controllers: [UserMgmtController],
    providers: [UserMgmtService, CareerProfileService, LearningHistoryService],
    exports: [UserMgmtService],
})
export class UserModule {}
