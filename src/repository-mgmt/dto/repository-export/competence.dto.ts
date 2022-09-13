import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CompetenceCreationDto } from '../competence-creation.dto';

export class CompetenceDto extends CompetenceCreationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
}
