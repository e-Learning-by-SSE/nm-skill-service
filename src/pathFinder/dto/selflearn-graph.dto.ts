import { IsDefined, IsNotEmpty } from 'class-validator';
import { SkillDto } from '../../skills/dto';
import { SelfLearnLearningUnitDto } from '../../learningUnit/dto';
import { SelfLearnEdgeDto } from '.';

export class SelfLearnGraphDto {
  @IsNotEmpty()
  edges: SelfLearnEdgeDto[];

  @IsDefined()
  skills: SkillDto[];

  @IsDefined()
  learningUnits: SelfLearnLearningUnitDto[];

  constructor() {}
}
