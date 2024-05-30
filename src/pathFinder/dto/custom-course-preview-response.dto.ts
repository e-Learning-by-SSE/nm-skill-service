import { IsDefined, IsNotEmpty, IsString } from "class-validator";

/**
 * Representation of a personalized if the user probes only the enrollment (preview) without actually enrolling (saving).
 */
export class CustomCoursePreviewResponseDto {
    @IsNotEmpty()
    goal: string[];

    @IsDefined()
    learningUnits: string[];

    static createFromDao(dao: {
        unitSequence: ReadonlyArray<string>;
        goal: string[];
    }): CustomCoursePreviewResponseDto {
        return {
            learningUnits: [...dao.unitSequence],
            goal: dao.goal,
        };
    }
}
