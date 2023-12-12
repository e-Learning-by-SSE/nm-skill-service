import { IsDate, IsDefined, IsNotEmpty, isDate } from "class-validator";

import { Skill } from "@prisma/client";

import { SkillCreationDto } from "./skill-creation.dto";
import { OmitType } from "@nestjs/swagger";

export class SkillDto extends OmitType(SkillCreationDto, ["owner", "nestedSkills"]) {
    @IsNotEmpty()
    id: string;

    @IsDefined()
    nestedSkills: string[];
    @IsDefined()
    parentSkills: string[];

    @IsDefined()
    repositoryId: string;

    @IsDefined()
    createdAt: string;

    @IsDefined()
    updatedAt: string;

    /**
     * Creates a new SkillDto from a DB result, but won't consider parents/children.
     * @param skill The DB result which shall be converted to a DTO
     * @returns The corresponding DTO, but without parents/children
     */
    static createFromDao(
        skill: Skill & {
            nestedSkills: { id: string }[];
            parentSkills?: { id: string }[];
        },
    ): SkillDto {
        const dto: SkillDto = {
            id: skill.id,
            name: skill.name,
            level: skill.level,
            description: skill.description ?? undefined,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((element) => element.id),
            parentSkills: skill.parentSkills?.map((element) => element.id) || [],
            createdAt: skill.createdAt.toISOString(),
            updatedAt: skill.updatedAt.toISOString(),
        };
        return dto;
    }
}
