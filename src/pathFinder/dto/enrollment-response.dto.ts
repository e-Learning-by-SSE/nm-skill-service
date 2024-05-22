import { IsNotEmpty, IsString } from "class-validator";
import { EnrollmentPreviewResponseDto } from "./enrollment-preview-response.dto";

/**
 * Representation of a personalized path after the user has been enrolled to a pre-defined course.
 * @author El-Sharkawy
 */
export class EnrollmentResponseDto extends EnrollmentPreviewResponseDto {
    @IsNotEmpty()
    @IsString()
    personalizedPathId: string;

    static createEnrollmentResponseFromDao(dao: {
        id: string;
        learningPathId: string;
        unitSequence: { unitId: string }[];
    }): EnrollmentResponseDto {
        return {
            learningUnits: dao.unitSequence.map((unit) => unit.unitId),
            learningPathId: dao.learningPathId,
            personalizedPathId: dao.id,
        };
    }
}
