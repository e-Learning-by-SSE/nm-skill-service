import { IsDefined } from "class-validator";
import { SkillDto } from "./skill.dto";

export class SkillListDto {
    @IsDefined()
    skills: SkillDto[];

    constructor() {
        this.skills = [];
    }
}
