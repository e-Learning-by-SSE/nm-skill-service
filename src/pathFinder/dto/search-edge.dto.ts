import { IsNotEmpty } from "class-validator";
import { SearchLearningUnitDto } from "../../learningUnit/dto";
import { SkillDto } from "../../skills/dto";

export class SearchEdgeDto {
    @IsNotEmpty()
    from: SkillDto | SearchLearningUnitDto;

    @IsNotEmpty()
    to: SkillDto | SearchLearningUnitDto;

    constructor(from: SkillDto | SearchLearningUnitDto, to: SkillDto | SearchLearningUnitDto) {
        this.from = from;
        this.to = to;
    }
}
