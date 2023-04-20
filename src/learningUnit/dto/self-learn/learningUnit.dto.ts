import { IsNotEmpty } from 'class-validator';

import { SelfLearnLearningUnitCreationDto } from './learningUnit-creation.dto';
import { SelfLearnLUDaoType } from 'src/learningUnit/types';

export class SelfLearnLearningUnitDto extends SelfLearnLearningUnitCreationDto {
  @IsNotEmpty()
  selfLearnId: number;

  constructor(id: number, language: string, title: string, description?: string | null, order?: number | null) {
    super(language, title, description, order);
    this.selfLearnId = id;
  }

  static createFromDao(unit: SelfLearnLUDaoType): SelfLearnLearningUnitDto {
    return new SelfLearnLearningUnitDto(
      unit.id,
      unit.language,
      unit.title,
      unit.description,
      unit.selfLearnInfos.order,
    );
  }
}
