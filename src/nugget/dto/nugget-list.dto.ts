import { IsDefined } from 'class-validator';

import { SkillDto } from './nugget.dto';

export class SkillListDto {
  @IsDefined()
  skills: SkillDto[];
}
