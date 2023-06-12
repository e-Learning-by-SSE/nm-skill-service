import { IsNotEmpty } from 'class-validator';
import { SelfLearnLearningUnitDto } from '../../learningUnit/dto';
import { SkillDto } from '../../skills/dto';

export class SelfLearnEdgeDto {
  @IsNotEmpty()
  from: SkillDto | SelfLearnLearningUnitDto;

  @IsNotEmpty()
  to: SkillDto | SelfLearnLearningUnitDto;

  constructor(from: SkillDto | SelfLearnLearningUnitDto, to: SkillDto | SelfLearnLearningUnitDto) {
    this.from = from;
    this.to = to;
  }
}
