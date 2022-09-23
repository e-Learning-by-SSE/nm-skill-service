import { IsNotEmpty } from 'class-validator';

import { Repository } from '@prisma/client';

import { RepositorySelectionDto } from '../repository-selection.dto';

export class RepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  id!: string;

  taxonomy?: string;
  description?: string;

  constructor(
    id: string,
    userId: string,
    name: string,
    version?: string | null,
    taxonomy?: string | null,
    description?: string | null,
  ) {
    super(name, version);
    this.id = id;
    this.userId = userId;
    this.taxonomy = taxonomy ?? undefined;
    this.description = description ?? undefined;
  }

  static createFromDao(repository: Repository): RepositoryDto {
    return new RepositoryDto(
      repository.id,
      repository.userId,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
    );
  }
}
