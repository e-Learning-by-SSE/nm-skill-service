import { Module } from "@nestjs/common";
import { SkillMgmtController } from "./skill.controller";
import { SkillMgmtService } from "./skill.service";
import { SkillRepositoryService } from "./skill-repository.service";

@Module({
    controllers: [SkillMgmtController],
    providers: [SkillMgmtService, SkillRepositoryService],
    exports: [SkillMgmtService, SkillRepositoryService],
})
export class SkillModule {}
