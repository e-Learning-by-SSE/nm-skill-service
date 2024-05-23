import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { LearningProgressDto } from ".";
import { STATUS } from "@prisma/client";

/**
 * Representation of a personalized path after the user has been enrolled to a pre-defined course.
 * @author El-Sharkawy
 */
export class EnrollmentResponseDto {
    @IsNotEmpty()
    @IsString()
    learningPathId: string;

    @IsDefined()
    learningUnits: LearningProgressDto[];

    @IsNotEmpty()
    @IsString()
    personalizedPathId: string;

    static createFromDao(dao: {
        id: string;
        learningPathId: string;
        unitSequence: { unit: { unitId: string; status: STATUS } }[];
    }): EnrollmentResponseDto {
        return {
            learningPathId: dao.learningPathId,
            learningUnits: dao.unitSequence.map((unit) =>
                LearningProgressDto.createFromDao(unit.unit),
            ),
            personalizedPathId: dao.id,
        };
    }
}
