import { IsDefined } from 'class-validator';

import { SelfLearnLearningUnitDto } from './learningUnit.dto';

export class SelfLearnLearningUnitListDto {
  @IsDefined()
  learningUnits: SelfLearnLearningUnitDto[] = [];
}
