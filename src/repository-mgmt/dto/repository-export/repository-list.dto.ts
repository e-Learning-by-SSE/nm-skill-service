import { IsDefined } from 'class-validator';

import { RepositoryDto } from './repository.dto';

/**
 * A list of (unresolved) repositories.
 */
export class RepositoryListDto {
  @IsDefined()
  repositories!: RepositoryDto[];
}
