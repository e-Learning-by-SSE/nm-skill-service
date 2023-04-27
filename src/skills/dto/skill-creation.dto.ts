import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Skill
 */
export class SkillCreationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  bloomLevel: number;

  @IsOptional()
  description?: string;

  constructor(name: string, bloomLevel: number, description: string | null) {
    this.name = name;
    this.bloomLevel = bloomLevel;
    this.description = description ?? undefined;
  }
}
