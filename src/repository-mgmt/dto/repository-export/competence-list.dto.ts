import { IsDefined } from 'class-validator';

import { CompetenceDto } from './competence.dto';

export class CompetenceListDto {
  @IsDefined()
  competencies: CompetenceDto[];
}
