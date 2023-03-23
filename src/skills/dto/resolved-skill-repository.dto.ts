import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';


import { SkillDto } from './skill.dto';

import { SkillRepositorySelectionDto } from './skill-repository-selection.dto';

export class ResolvedSkillRepositoryDto extends SkillRepositorySelectionDto {
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  taxonomy?: string;
  @IsOptional()
  description?: string;

  @IsDefined()
  skills!: SkillDto[];
 

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
      skills: <SkillDto[]>[],
      
    };
  }
}
