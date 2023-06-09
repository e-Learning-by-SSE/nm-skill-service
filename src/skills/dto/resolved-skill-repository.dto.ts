import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { ResolvedSkillDto } from './skill.resolved.dto';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';
import { SkillMap } from '@prisma/client';

export class ResolvedSkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  taxonomy?: string;
  @IsOptional()
  description?: string;

  @IsDefined()
  skills!: ResolvedSkillDto[];

  constructor(id: string, name: string, version: string, taxonomy: string | null, description: string | null) {
    super(name, version);
    this.id = id;
    this.taxonomy = taxonomy ?? undefined;
    this.description = description ?? undefined;
    this.skills = [];
  }

  static createFromDao(repository: SkillMap): ResolvedSkillRepositoryDto {
    return new ResolvedSkillRepositoryDto(
      repository.id,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
    );
  }
}
