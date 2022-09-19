import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceCreationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;
}
