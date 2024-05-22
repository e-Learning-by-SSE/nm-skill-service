import { IsDefined, IsNotEmpty, IsString } from "class-validator";

/**
 * Representation of a personalized if the user probes only the enrollment (preview) without actually enrolling (saving).
 */
export class EnrollmentPreviewResponseDto {
    @IsNotEmpty()
    @IsString()
    learningPathId: string;

    @IsDefined()
    learningUnits: string[];

    static createPreviewResponseFromDao(dao: {
        unitSequence: ReadonlyArray<string>;
        learningPathId: string;
    }): EnrollmentPreviewResponseDto {
        return {
            learningUnits: [...dao.unitSequence],
            learningPathId: dao.learningPathId,
        };
    }
}
