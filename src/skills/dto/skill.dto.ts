import { IsNotEmpty } from 'class-validator';

import { Competence, Skill } from '@prisma/client';

import { SkillCreationDto } from './skill-creation.dto';

export class SkillDto extends SkillCreationDto {
  @IsNotEmpty()
  id!: string;

  constructor(id: string, name: string, bloomLevel: number, description?: string | null) {
    super(name, bloomLevel, description);
    this.id = id;
  }

  static createFromDao(skill: Skill): SkillDto {
    return new SkillDto(skill.id, skill.name  , skill.bloomLevel, skill.description);
  }
}
