import { IsNotEmpty } from 'class-validator';

import { SkillMap } from '@prisma/client';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';

export class SkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;

  constructor(
    id: string,
    owner: string,
    name: string,
    version: string | null,
    taxonomy: string | null,
    description: string | null,
  ) {
    super(name, version);
    this.id = id;
    this.owner = owner;
    this.taxonomy = taxonomy ?? undefined;
    this.description = description ?? undefined;
  }

  static createFromDao(repository: SkillMap): SkillRepositoryDto {
    return new SkillRepositoryDto(
      repository.id,
      repository.owner,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
    );
  }
}
