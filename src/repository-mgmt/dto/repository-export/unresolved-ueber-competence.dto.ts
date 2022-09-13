import { IsNotEmpty } from 'class-validator';

import { UeberCompetenceCreationDto } from '../ueber-competence-creation.dto';

export class UnResolvedUeberCompetenceDto extends UeberCompetenceCreationDto {
  @IsNotEmpty()
  id: string;

  parents: string[];
  nestedCompetencies: string[];
  nestedUeberCompetencies: string[];
}
