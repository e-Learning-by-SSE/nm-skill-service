import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Groups a set of Learning Objects that belong together.
 */
export class LearningObjectGroupCreationDto {
  @IsNotEmpty()
  repositoryId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  nestedLearningObjects?: string[];

  @IsOptional()
  nestedGroups?: string[];
}
