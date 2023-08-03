import { ACCESS_RIGHTS } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Request data to create a new Skill repository.
 */
export class SkillRepositoryCreationDto {
  @IsNotEmpty()
  ownerId!: string;

  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  version?: string;

  @IsOptional()
  access_rights?: ACCESS_RIGHTS;
  
}
