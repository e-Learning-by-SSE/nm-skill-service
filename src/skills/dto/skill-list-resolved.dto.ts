import { IsDefined } from 'class-validator';

import { ResolvedSkillDto } from './skill.resolved.dto';

export class ResolvedSkillListDto {
  @IsDefined()
  skills: ResolvedSkillDto[];

  constructor() {
    this.skills = [];
  }
}
