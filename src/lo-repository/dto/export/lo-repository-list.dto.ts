import { ShallowLoRepositoryDto } from './lo-repository-shallow.dto';

export class LoRepositoryListDto {
  repositories: ShallowLoRepositoryDto[];

  constructor() {
    this.repositories = <ShallowLoRepositoryDto[]>[];
  }
}
