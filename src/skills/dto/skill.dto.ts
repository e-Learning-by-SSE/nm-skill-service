import { IsNotEmpty } from 'class-validator';

import { Skill } from '@prisma/client';

import { SkillCreationDto } from './skill-creation.dto';

export class SkillDto extends SkillCreationDto {
  @IsNotEmpty()
  id: string;

  constructor(id: string, name: string, level: number, description: string | null) {
    super(name, level, description);
    this.id = id;
  }

  static createFromDao(skill: Skill): SkillDto {
    return new SkillDto(skill.id, skill.name, skill.level, skill.description);
  }
}
