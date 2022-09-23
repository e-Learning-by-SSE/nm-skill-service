import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Concept
 */
export class CompetenceCreationDto {
  @IsNotEmpty()
  skill!: string;

  @IsNotEmpty()
  level!: number;

  @IsOptional()
  description?: string;

  constructor(skill: string, level: number, description?: string | null) {
    this.skill = skill;
    this.level = level;
    this.description = description ?? undefined;
  }
}
