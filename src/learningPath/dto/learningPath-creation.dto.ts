import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { PathGoalCreationDto } from './pathGoal-creation.dto';

/**
 * Creates a new LearningPath.
 *
 * Objects are usually crated via Swagger (or tests) -> For this reason no constructor defined
 */
export class LearningPathCreationDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  goals: PathGoalCreationDto[];
}
