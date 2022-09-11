import { ApiPropertyOptional } from '@nestjs/swagger';

import { RepositorySelectionDto } from './repository-selection.dto';

export class RepositoryCreationDto extends RepositorySelectionDto {
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ required: false, default: 'Bloom' })
  taxonomy = 'Bloom';
}
