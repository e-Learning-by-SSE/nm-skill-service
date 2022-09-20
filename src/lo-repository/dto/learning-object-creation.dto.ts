import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Learning Object.
 */
export class LearningObjectCreationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  requiredCompetencies: string[];
  requiredUeberCompetencies: string[];
  offeredCompetencies: string[];
  offeredUeberCompetencies: string[];
}
