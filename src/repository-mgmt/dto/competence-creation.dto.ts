import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  description?: string;
}
