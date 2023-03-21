import { IsDefined } from 'class-validator';

import { SkillRepositoryDto } from './skill-repository.dto';

/**
 * A list of (unresolved) repositories.
 */
export class SkillRepositoryListDto {
  @IsDefined()
  repositories!: SkillRepositoryDto[];
}
