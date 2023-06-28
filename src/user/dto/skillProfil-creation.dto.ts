import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Skill.
 */
export class SkillProfileCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */
  @IsOptional()
  jobHistory?: string;

  @IsOptional()
  professionalInterests?: string;

  @IsDefined()
  userId: string;


}
