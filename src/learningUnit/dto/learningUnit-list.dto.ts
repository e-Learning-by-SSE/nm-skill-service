import { IsDefined } from "class-validator";
import { SearchLearningUnitDto } from "./learningUnit.dto";

export class SearchLearningUnitListDto {
    @IsDefined()
    learningUnits: SearchLearningUnitDto[] = [];
}
