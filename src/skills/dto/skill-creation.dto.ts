import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Skill.
 */
export class SkillCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */
  @IsNotEmpty()
  owner!: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  level: number;

  @IsOptional()
  description?: string;

  @IsDefined()
  nestedSkills: SkillCreationDto[];
}
