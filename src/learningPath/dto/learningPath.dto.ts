import { IsDefined, IsNotEmpty } from 'class-validator';

import { LearningPath, PathGoal } from '@prisma/client';

import { LearningPathCreationDto } from './learningPath-creation.dto';
import { OmitType } from '@nestjs/swagger';
import { PathGoalDto } from '.';

export class LearningPathDto extends OmitType(LearningPathCreationDto, ['goals']) {
  @IsNotEmpty()
  id: string;

  @IsDefined()
  goals: PathGoalDto[];

  constructor(id: string, title: string, description: string | null, goals: PathGoalDto[]) {
    super();
    this.id = id;
    this.title = title;
    this.description = description ?? undefined;
    this.goals = goals;
  }

  static createFromDao(lp: LearningPath & { goals: PathGoal[] | null }): LearningPathDto {
    const goals: PathGoalDto[] = lp.goals?.map((goal) => PathGoalDto.createFromDao(goal)) ?? [];

    return new LearningPathDto(lp.id, lp.title, lp.description, goals);
  }
}
