import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { ResolvedSkillDto } from '../../skills/dto';

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

  constructor(
    title: string,
    targetAudience: string | null,
    description: string | null,
    requirements: ResolvedSkillDto[],
    pathGoals: ResolvedSkillDto[],
  ) {
    this.title = title;
    this.targetAudience = targetAudience ?? undefined;
    this.description = description ?? undefined;

    this.requirements = requirements;
    this.pathGoals = pathGoals;
  }
}
