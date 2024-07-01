import { IsDefined } from "class-validator";
import { SkillRepositoryDto } from "./skill-repository.dto";
import { SkillMap } from "@prisma/client";

export class UnresolvedSkillRepositoryDto extends SkillRepositoryDto {
    @IsDefined()
    skills!: string[];

    static createDtoFromDao(
        dao: SkillMap & { skills: { id: string }[] },
    ): UnresolvedSkillRepositoryDto {
        return {
            ...SkillRepositoryDto.createFromDao(dao),
            skills: dao.skills.map((c) => c.id),
        };
    }
}
