import { IsDefined } from "class-validator";
import { LearningPathDto } from ".";

export class LearningPathListDto {
    @IsDefined()
    learningPaths: LearningPathDto[];
}
