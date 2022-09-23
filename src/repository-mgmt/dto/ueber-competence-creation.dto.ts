import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceCreationDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  constructor(name: string, description?: string | null) {
    this.name = name;
    this.description = description ?? undefined;
  }
}
