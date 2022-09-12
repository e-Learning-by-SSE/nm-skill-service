import { IsNotEmpty } from 'class-validator';

import { CompetenceDto } from './competence.dto';
import { RepositorySelectionDto } from './repository-selection.dto';
import { UeberCompetenceDto } from './ueber-competence.dto';

export class RepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  id: string;

  competencies: CompetenceDto[];
  ueberCompetencies: UeberCompetenceDto[];
}
