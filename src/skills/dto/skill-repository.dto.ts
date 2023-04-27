import { IsNotEmpty } from 'class-validator';

import { SkillRepository } from '@prisma/client';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';

export class SkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;

  constructor(
    id: string,
    ownerId: string,
    name: string,
    version: string | null,
    taxonomy: string | null,
    description: string | null,
  ) {
    super(name, version);
    this.id = id;
    this.ownerId = ownerId;
    this.taxonomy = taxonomy ?? undefined;
    this.description = description ?? undefined;
  }

  static createFromDao(repository: SkillRepository): SkillRepositoryDto {
    return new SkillRepositoryDto(
      repository.id,
      repository.ownerId,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
    );
  }
}
