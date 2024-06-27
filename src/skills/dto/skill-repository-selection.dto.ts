import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * Identifies an existing Repository.
 */
export class SkillRepositorySelectionDto {
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    version?: string;
}
