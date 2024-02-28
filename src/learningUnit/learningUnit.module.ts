import { Module } from "@nestjs/common";
import { LearningUnitMgmtService } from "./learningUnit.service";
import { LearningUnitFactory } from "./learningUnitFactory";
import { SearchLearningUnitController } from "./learningUnit.search.controller";

@Module({
    controllers: [SearchLearningUnitController],
    providers: [LearningUnitMgmtService, LearningUnitFactory],
    exports: [LearningUnitMgmtService, LearningUnitFactory],
})
export class LearningUnitModule {}
