import { IsDefined } from "class-validator";
import { SkillRepositoryDto } from "./skill-repository.dto";

export class UnresolvedSkillRepositoryDto extends SkillRepositoryDto {
    @IsDefined()
    skills!: string[];
}
