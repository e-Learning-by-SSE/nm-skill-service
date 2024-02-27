import { Module } from "@nestjs/common";

import { UserMgmtController } from "./user.controller";
import { UserMgmtService } from "./user.service";
import { CareerProfileService } from "./careerProfileService/careerProfile.service";
import { LearningHistoryService } from "./learningHistoryService/learningHistory.service";
import { LearningProfileService } from "./learningProfileService/learningProfile.service";

@Module({
    controllers: [UserMgmtController],
    providers: [
        UserMgmtService,
        CareerProfileService,
        LearningHistoryService,
        LearningProfileService,
    ],
    exports: [UserMgmtService],
})
export class UserModule {}
