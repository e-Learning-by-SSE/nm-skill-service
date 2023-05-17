import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Skill.
 */
export class SkillCreationDto {
  @IsNotEmpty()
  owner!: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  level: number;

  @IsOptional()
  description?: string;

  @IsDefined()
  parentSkills: SkillCreationDto[];

  @IsDefined()
  nestedSkills: SkillCreationDto[];
}
