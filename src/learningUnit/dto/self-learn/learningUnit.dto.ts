import { IsNotEmpty } from 'class-validator';

import { SelfLearnLearningUnitCreationDto } from './learningUnit-creation.dto';
import { SelfLearnLUDaoType } from '../../types';

export class SelfLearnLearningUnitDto extends SelfLearnLearningUnitCreationDto {
  @IsNotEmpty()
  selfLearnId: string;

  constructor(
    id: string,
    language: string,
    title: string,
    resource: string,
    description?: string | null,
    order?: number | null,
  ) {
    super(language, title, resource, description, order);
    this.selfLearnId = id;
  }

  static createFromDao(unit: SelfLearnLUDaoType): SelfLearnLearningUnitDto {
    return new SelfLearnLearningUnitDto(
      unit.id,
      unit.language,
      unit.title,
      unit.resource,
      unit.description,
      unit.selfLearnInfos.order,
    );
  }
}
