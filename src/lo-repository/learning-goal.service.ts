import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LoGoalListDto } from './dto/export/lo-goal-list.dto';
import { LoGoalDto } from './dto/export/lo-goal.dto';
import { LoRepositoryService } from './lo-repository.service';

@Injectable()
export class LearningGoalService {
  constructor(private db: PrismaService, private loRepositoryService: LoRepositoryService) {}

  private async getGoal(goalId: string) {
    const goal = await this.db.learningGoal.findUnique({
      where: {
        id: goalId,
      },
      include: {
        lowLevelGoals: true,
        highLevelGoals: true,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Learning Goal not found: ${goalId}`);
    }

    return LoGoalDto.createFromDao(goal);
  }

  async listGoals(repositoryId: string) {
    const repository = await this.loRepositoryService.getRepository(repositoryId, false, true);
    const result = LoGoalListDto.createFromDao(repository);

    for (const goal of repository.learningGoals) {
      const g = await this.getGoal(goal.id);
      result.goals.push(g);
    }

    return result;
  }

  async showGoal(goalId: string) {
    return this.getGoal(goalId);
  }
}
