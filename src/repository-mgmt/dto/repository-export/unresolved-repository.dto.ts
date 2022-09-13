import { RepositoryDto } from './repository.dto';

export class UnresolvedRepositoryDto extends RepositoryDto {
  competencies: string[];
  ueberCompetencies: string[];
}
