import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceCreationDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  /**
   * Complete list of all directly nested Competencies. Overwrites old settings.
   */
  nestedCompetencies?: string[];

  @IsOptional()
  /**
   * Complete list of all directly nested Ueber-Competencies. Overwrites old settings.
   */
  nestedUeberCompetencies?: string[];

  constructor(name: string, description?: string | null) {
    this.name = name;
    this.description = description ?? undefined;
  }
}
