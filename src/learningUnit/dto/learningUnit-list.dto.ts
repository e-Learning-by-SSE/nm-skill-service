import { IsDefined } from 'class-validator';

import { LearningUnitDto } from './learningUnit.dto';

export class LearningUnitListDto {
  @IsDefined()
  learningUnits: LearningUnitDto[];
}
