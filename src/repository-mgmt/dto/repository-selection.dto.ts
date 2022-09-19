import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Identifies an existing Repository.
 */
export class RepositorySelectionDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  version = '';
}
