import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { ResolvedSkillDto } from './skill.resolved.dto';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';

export class ResolvedSkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  taxonomy?: string;
  @IsOptional()
  description?: string;

  @IsDefined()
  skills!: ResolvedSkillDto[];

  static create(
    id: string,
    name: string,
    version: string,
    taxonomy?: string | null,
    description?: string | null,
  ): ResolvedSkillRepositoryDto {
    return {
      id: id,
      name: name,
      version: version,
      taxonomy: taxonomy ?? undefined,
      description: description ?? undefined,
      skills: <ResolvedSkillDto[]>[],
    };
  }
}
