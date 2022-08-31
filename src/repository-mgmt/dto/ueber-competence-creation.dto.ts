import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceCreationDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  // Specifies at which repository the concept shall be added to
  @IsNotEmpty()
  @ApiProperty({ required: true })
  repositoryID: string;
}
