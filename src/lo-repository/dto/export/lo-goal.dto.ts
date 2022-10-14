import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { Competence, LearningGoal, UeberCompetence } from '@prisma/client';

export class LoGoalDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  repositoryId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  competencies: string[];

  @IsDefined()
  uberCompetencies: string[];

  constructor(
    id: string,
    repositoryId: string,
    name: string,
    description: string | null,
    competencies?: string[] | null,
    uberCompetencies?: string[] | null,
  ) {
    this.id = id;
    this.repositoryId = repositoryId;
    this.name = name;
    this.description = description ?? undefined;
    this.competencies = competencies ?? [];
    this.uberCompetencies = uberCompetencies ?? [];
  }

  static createFromDao(
    goal: LearningGoal & {
      lowLevelGoals?: Competence[];
      highLevelGoals?: UeberCompetence[];
    },
  ) {
    return new LoGoalDto(
      goal.id,
      goal.loRepositoryId,
      goal.name,
      goal.description,
      goal.lowLevelGoals?.map((c) => c.id),
      goal.highLevelGoals?.map((uc) => uc.id),
    );
  }
}
