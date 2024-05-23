import { Module } from "@nestjs/common";
import { PathFinderController } from "./pathFinder.controller";
import { PathFinderService } from "./pathFinder.service";
import { LearningUnitModule } from "../learningUnit/learningUnit.module";
import { SkillModule } from "../skills/skill.module";
import { UserModule } from "../user/user.module";

@Module({
    controllers: [PathFinderController],
    imports: [LearningUnitModule, SkillModule, UserModule],
    providers: [PathFinderService],
})
export class PathFinderModule {}
