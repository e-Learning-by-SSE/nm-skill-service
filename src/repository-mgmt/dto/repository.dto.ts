import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CompetenceDto } from './competence.dto';
import { RepositorySelectionDto } from './repository-selection.dto';
import { UeberCompetenceDto } from './ueber-competence.dto';

export class RepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @ApiProperty()
  competencies: CompetenceDto[];
  @ApiProperty()
  ueberCompetencies: UeberCompetenceDto[];
}
