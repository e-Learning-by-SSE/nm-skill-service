import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { RepositoryDto } from './repository.dto';

export class RepositoryCreationDto extends RepositoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}
