import { IsNotEmpty } from 'class-validator';

import { ACCESS_RIGHTS, SkillMap } from '@prisma/client';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';

export class SkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;
  access_rights?: ACCESS_RIGHTS;
  constructor(
    id: string,
    owner: string,
    name: string,
    version: string | null,
    taxonomy: string | null,
    description: string | null,
    access_right: ACCESS_RIGHTS | null,
  ) {
    super(name, version);
    this.id = id;
    this.owner = owner;
    this.taxonomy = taxonomy ?? undefined;
    this.description = description ?? undefined;
    this.access_rights = access_right ?? undefined;
  }

  static createFromDao(repository: SkillMap): SkillRepositoryDto {
    return new SkillRepositoryDto(
      repository.id,
      repository.ownerId,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
      repository.access_rights,
    );
  }
}
