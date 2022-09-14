import { ApiPropertyOptional } from '@nestjs/swagger';

import { RepositorySelectionDto } from './repository-selection.dto';

export class RepositoryCreationDto extends RepositorySelectionDto {
  description?: string;

  taxonomy? = 'Bloom';
}
