import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Request data to create a new Skill repository.
 */
export class SkillRepositoryCreationDto {
  @IsNotEmpty()
  owner!: string;

  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;
}
