import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CompetenceDto } from './competence.dto';
import { UeberCompetenceCreationDto } from './ueber-competence-creation.dto';

export class UeberCompetenceDto extends UeberCompetenceCreationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @ApiProperty()
  parent: UeberCompetenceDto;
  @IsOptional()
  @ApiProperty()
  nestedCompetencies: CompetenceDto[];
  @IsOptional()
  @ApiProperty()
  nestedUeberCompetencies: UeberCompetenceDto[];
}
