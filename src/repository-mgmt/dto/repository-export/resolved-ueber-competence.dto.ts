import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { CompetenceDto } from './competence.dto';

export class ResolvedUeberCompetenceDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  nestedCompetencies!: CompetenceDto[];
  @IsDefined()
  nestedUeberCompetencies!: ResolvedUeberCompetenceDto[];
}
