import { Module } from "@nestjs/common";
import { UserMgmtController } from "./user.controller";
import { UserMgmtService } from "./user.service";
import { CareerProfileService } from "./careerProfileService/careerProfile.service";
import { LearningHistoryService } from "./learningHistoryService/learningHistory.service";
import { LearningProfileService } from "./learningProfileService/learningProfile.service";
import { CareerProfileController } from "./careerProfileService/careerProfile.controller";
import { LearningProfileController } from "./learningProfileService/learningProfile.controller";
import { LearningHistoryController } from "./learningHistoryService/learningHistory.controller";

@Module({
    controllers: [
        UserMgmtController,
        CareerProfileController,
        LearningProfileController,
        LearningHistoryController,
    ],
    providers: [
        UserMgmtService,
        CareerProfileService,
        LearningHistoryService,
        LearningProfileService,
    ],
    exports: [UserMgmtService, LearningHistoryService],
})
export class UserModule {}
