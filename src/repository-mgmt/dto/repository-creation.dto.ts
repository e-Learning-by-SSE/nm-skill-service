import { IsOptional } from 'class-validator';

import { RepositorySelectionDto } from './repository-selection.dto';

export class RepositoryCreationDto extends RepositorySelectionDto {
  @IsOptional()
  description?: string;

  @IsOptional()
  taxonomy?: string;
}
