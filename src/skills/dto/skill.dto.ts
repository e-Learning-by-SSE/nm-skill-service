import { IsDefined, IsNotEmpty } from 'class-validator';

import { Skill } from '@prisma/client';

import { SkillCreationDto } from './skill-creation.dto';
import { OmitType } from '@nestjs/swagger';

export class SkillDto extends OmitType(SkillCreationDto, ['parentSkills', 'nestedSkills']) {
  @IsNotEmpty()
  id: string;

  @IsDefined()
  nestedSkills: SkillDto[];

  constructor(id: string, name: string, level: number, description: string | null) {
    super();
    this.name = name;
    this.level = level;
    this.description = description ?? undefined;
    this.id = id;
    this.nestedSkills = [];
  }

  /**
   * Creates a new SkillDto from a DB result, but won't consider parents/children.
   * @param skill The DB result which shall be converted to a DTO
   * @returns The corresponding DTO, but without parents/children
   */
  static createFromDao(skill: Skill): SkillDto {
    return new SkillDto(skill.id, skill.name, skill.level, skill.description);
  }
}
