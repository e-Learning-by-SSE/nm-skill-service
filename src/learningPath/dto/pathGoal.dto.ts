import { IsNotEmpty } from 'class-validator';
import { PathGoalCreationDto } from './pathGoal-creation.dto';
import { PathGoal, Skill } from '@prisma/client';
import { SkillDto } from '../../skills/dto';

/**
 * Represents a LearningPath Goal for a specific audience.
 */
export class PathGoalDto extends PathGoalCreationDto {
  @IsNotEmpty()
  id: string;

  constructor(
    id: string,
    title: string,
    targetAudience: string | null,
    description: string | null,
    requirements: SkillDto[],
    pathGoals: SkillDto[],
  ) {
    super(title, targetAudience, description, requirements, pathGoals);
    this.id = id;
  }

  static createFromDao(
    dao: PathGoal & {
      requirements?: Skill[] | null;
      pathTeachingGoals?: Skill[] | null;
    },
  ): PathGoalDto {
    const requirements: SkillDto[] = dao.requirements?.map((skill) => SkillDto.createFromDao(skill)) ?? [];
    const pathTeachingGoals: SkillDto[] = dao.pathTeachingGoals?.map((skill) => SkillDto.createFromDao(skill)) ?? [];

    return new PathGoalDto(dao.id, dao.title, dao.targetAudience, dao.description, requirements, pathTeachingGoals);
  }
}
