import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Learning Object.
 */
export class LearningObjectModificationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  requiredCompetencies?: string[];
  @IsOptional()
  requiredUeberCompetencies?: string[];
  @IsOptional()
  offeredCompetencies?: string[];
  @IsOptional()
  offeredUeberCompetencies?: string[];
}
