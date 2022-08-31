import { ApiPropertyOptional } from '@nestjs/swagger';

import { RepositoryDto } from './repository.dto';

export class RepositoryCreationDto extends RepositoryDto {
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ required: false, default: 'Bloom' })
  taxonomy = 'Bloom';
}
