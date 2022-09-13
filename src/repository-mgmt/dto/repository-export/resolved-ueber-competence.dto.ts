import { IsNotEmpty } from 'class-validator';

import { UeberCompetenceCreationDto } from '../ueber-competence-creation.dto';
import { CompetenceDto } from './competence.dto';

export class ResolvedUeberCompetenceDto extends UeberCompetenceCreationDto {
  @IsNotEmpty()
  id: string;

  nestedCompetencies: CompetenceDto[];
  nestedUeberCompetencies: ResolvedUeberCompetenceDto[];
}
