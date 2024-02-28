import { IsDefined, IsNotEmpty } from "class-validator";
import { SkillCreationDto } from "./skill-creation.dto";
import { OmitType } from "@nestjs/swagger";

export class SkillUpdateDto extends OmitType(SkillCreationDto, ["owner", "nestedSkills"]) {
    @IsNotEmpty()
    id: string;

    @IsDefined()
    nestedSkills: string[];
    @IsDefined()
    parentSkills: string[];

    @IsDefined()
    repositoryId: string;

    constructor(
        id: string,
        name: string,
        level: number,
        description: string | null,
        repositoryId: string,
        nestedSkills: string[],
        parentSkills: string[],
    ) {
        super();
        this.name = name;
        this.level = level;
        this.description = description ?? undefined;
        this.id = id;
        this.nestedSkills = nestedSkills;
        this.parentSkills = parentSkills;
        this.repositoryId = repositoryId;
    }
}
