import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Creates a new Ueber-Competence
 */
export class UeberCompetenceModificationDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'The Ueber-Competence to change' })
  ueberCompetenceId: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    default: [],
    description: 'Complete list of all directly nested Competencies. Will overwirte old settings.',
  })
  nestedCompetencies: string[];

  @ApiProperty({
    required: true,
    default: [],
    description: 'Complete list of all directly nested Ueber-Competencies. Will overwirte old settings.',
  })
  nestedUeberCompetencies: string[];
}
