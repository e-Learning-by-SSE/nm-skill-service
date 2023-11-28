import { IsDefined } from "class-validator";

export class ErrorSynopsisDto {
    /**
     * The root cause of the error in human-readable form.
     */
    @IsDefined()
    cause: string;

    /**
     * The error type.
     */
    @IsDefined()
    type: ErrorType;

    /**
     * The list of skills that are affected by the error.
     * Possibly empty.
     */
    @IsDefined()
    affectedSkills: string[] = [];

    /**
     * The list of learning units that are affected by the error.
     * Possibly empty.
     */
    @IsDefined()
    affectedLearningUnits: string[] = [];
}

export enum ErrorType {
    CYCLE_DETECTED = "CYCLE_DETECTED",
    PATH_NOT_FOUND = "PATH_NOT_FOUND",
}
