import { IsDefined, IsOptional } from "class-validator";

/**
 * Creates a new Skill.
 */
export class LearningProfileCreationDto {
    /**
     * Used to validate that the user is the owner of the target repository.
     */
    @IsOptional()
    mediaType?: string;

    @IsOptional()
    language?: string;

    @IsOptional()
    semanticDensity?: number;

    @IsOptional()
    semanticGravity?: number;

    @IsOptional()
    processingTimePerUnit?: string;

    @IsOptional()
    learningHistoryId?: string;

    @IsOptional()
    preferredDidacticMethod?: string;

    @IsDefined()
    userId: string;
}
