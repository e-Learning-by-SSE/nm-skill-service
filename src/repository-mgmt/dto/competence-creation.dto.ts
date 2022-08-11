import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { RepositoryDto } from './repository.dto';

/**
 * Creates a new Concept
 */
export class CompetenceCreationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  skill: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  // Specifies at which repository the concept shall be added to
  @IsNotEmpty()
  @ApiProperty()
  repository: RepositoryDto;
}
