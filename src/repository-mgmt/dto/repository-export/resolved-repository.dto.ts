import { IsNotEmpty } from 'class-validator';

import { RepositorySelectionDto } from '../repository-selection.dto';
import { CompetenceDto } from './competence.dto';
import { ResolvedUeberCompetenceDto } from './resolved-ueber-competence.dto';

export class ResolvedRepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  id: string;

  competencies: CompetenceDto[];
  ueberCompetencies: ResolvedUeberCompetenceDto[];
}
