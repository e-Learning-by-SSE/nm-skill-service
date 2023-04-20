import { IsDefined } from 'class-validator';
import { SearchLearningUnitDto } from './search';
import { SelfLearnLearningUnitDto } from './self-learn';

export class LearningUnitListDto<LU extends SearchLearningUnitDto | SelfLearnLearningUnitDto> {
  @IsDefined()
  learningUnits: LU[];
}
