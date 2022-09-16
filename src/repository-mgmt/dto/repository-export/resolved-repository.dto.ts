import { IsNotEmpty } from 'class-validator';

import { RepositorySelectionDto } from '../repository-selection.dto';
import { CompetenceDto } from './competence.dto';
import { ResolvedUeberCompetenceDto } from './resolved-ueber-competence.dto';

export class ResolvedRepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;

  competencies: CompetenceDto[];
  ueberCompetencies: ResolvedUeberCompetenceDto[];

  static create(
    id: string,
    name: string,
    version: string,
    taxonomy?: string | null,
    description?: string | null,
  ): ResolvedRepositoryDto {
    return {
      id: id,
      name: name,
      version: version,
      taxonomy: taxonomy ?? undefined,
      description: description ?? undefined,
      competencies: <CompetenceDto[]>[],
      ueberCompetencies: <ResolvedUeberCompetenceDto[]>[],
    };
  }
}
