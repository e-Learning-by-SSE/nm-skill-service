import { IsDefined } from "class-validator";

/**
 * DTO to request a default ordering of learning units.
 */
export class PreferredPathDto {
    @IsDefined()
    learningUnits!: string[];
}
