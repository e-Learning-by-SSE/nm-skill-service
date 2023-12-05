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

    constructor(
        id: string,
        name: string,
        level: number,
        description: string | null,
        repositoryId: string,
        nestedSkills: string[],
        parentSkills: string[],
        createdAt: string,
        updatedAt: string,
    ) {
        super();
        this.name = name;
        this.level = level;
        this.description = description ?? undefined;
        this.id = id;
        this.nestedSkills = nestedSkills;
        this.parentSkills = parentSkills;
        this.repositoryId = repositoryId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Creates a new SkillDto from a DB result, but won't consider parents/children.
     * @param skill The DB result which shall be converted to a DTO
     * @returns The corresponding DTO, but without parents/children
     */
    static createFromDao(skill: Skill, nestedSkills?: Skill[], parentSkills?: Skill[]): SkillDto {
        const nestedSkillIds = nestedSkills?.map((element) => element.id) || [];
        const parentSkillIds = parentSkills?.map((element) => element.id) || [];
        return new SkillDto(
            skill.id,
            skill.name,
            skill.level,
            skill.description,
            skill.repositoryId,
            nestedSkillIds,
            parentSkillIds,
            skill.createdAt.toString(),
            skill.updatedAt.toString(),
        );
    }
}
