import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { PathGoalCreationDto } from './pathGoal-creation.dto';

/**
 * Creates a new LearningPath.
 */
export class LearningPathCreationDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  goals: PathGoalCreationDto[];
}
