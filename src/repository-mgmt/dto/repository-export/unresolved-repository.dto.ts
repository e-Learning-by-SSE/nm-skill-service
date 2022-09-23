import { IsDefined } from 'class-validator';

import { RepositoryDto } from './repository.dto';

export class UnresolvedRepositoryDto extends RepositoryDto {
  @IsDefined()
  competencies!: string[];
  @IsDefined()
  ueberCompetencies!: string[];
}
