import { IsNotEmpty } from 'class-validator';

import { RepositorySelectionDto } from '../repository-selection.dto';

export class RepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;
}
