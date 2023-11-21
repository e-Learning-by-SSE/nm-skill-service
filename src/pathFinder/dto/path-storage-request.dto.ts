import { IsDefined, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";

/**
 * Request to store a personal path of an learner.
 * The path may originate from a personalized path of a pre-defined path,
 * or may be computed by specifying a goal (skills) requested by the learner.
 */
export class PathStorageRequestDto {
    /**
     * The personalized path of the learner to be stored.
     */
    @IsDefined()
    @IsNotEmpty()
    units: string[];

    /**
     * The pre-defined learning path which was personalized for the learner.
     * Must be defined, unless `goal` is defined.
     */
    @ValidateIf((o) => !o.goal)
    @IsDefined()
    originPathId?: string;

    /**
     * A personal learning goal of the learner.
     * Must be defined, unless `originPathId` is defined.
     */
    @ValidateIf((o) => !o.originPathId)
    @IsNotEmpty()
    goal?: string[];
}
