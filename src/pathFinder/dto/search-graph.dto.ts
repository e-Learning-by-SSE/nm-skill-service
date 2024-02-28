import { IsDefined, IsNotEmpty } from "class-validator";
import { SkillDto } from "../../skills/dto";
import { SearchLearningUnitDto } from "src/learningUnit/dto";
import { SearchEdgeDto } from ".";

export class SearchGraphDto {
    @IsNotEmpty()
    edges: SearchEdgeDto[] = [];

    @IsDefined()
    skills: SkillDto[] = [];

    @IsDefined()
    learningUnits: SearchLearningUnitDto[] = [];

    constructor() {}
}
