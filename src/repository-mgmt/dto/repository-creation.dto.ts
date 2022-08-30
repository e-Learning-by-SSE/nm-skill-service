import { ApiProperty } from '@nestjs/swagger';

import { RepositoryDto } from './repository.dto';

export class RepositoryCreationDto extends RepositoryDto {
  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: 'Bloom' })
  taxonomy = 'Bloom';
}
