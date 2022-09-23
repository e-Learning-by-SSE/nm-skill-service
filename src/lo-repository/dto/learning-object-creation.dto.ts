import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Learning Object.
 */
export class LearningObjectCreationDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  requiredCompetencies!: string[];
  @IsDefined()
  requiredUeberCompetencies!: string[];
  @IsDefined()
  offeredCompetencies!: string[];
  @IsDefined()
  offeredUeberCompetencies!: string[];
}
