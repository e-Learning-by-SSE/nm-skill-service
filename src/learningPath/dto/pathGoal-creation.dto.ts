import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { ResolvedSkillDto } from "../../skills/dto";

/**
 * Creates a new LearningPath Goal for a specific audience.
 */
export class PathGoalCreationDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    targetAudience?: string;

    @IsOptional()
    description?: string;

    @IsDefined()
    requirements: ResolvedSkillDto[];

    @IsDefined()
    pathGoals: ResolvedSkillDto[];
}
