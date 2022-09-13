import { IsNotEmpty } from 'class-validator';

/**
 * Identifies an existing Repository.
 */
export class RepositorySelectionDto {
  @IsNotEmpty()
  name: string;

  version = '';
}
