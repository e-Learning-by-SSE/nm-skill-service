import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Concept
 */
export class CompetenceCreationDto {
  @IsNotEmpty()
  skill: string;

  @IsNotEmpty()
  level: number;

  @IsOptional()
  description?: string;
}
