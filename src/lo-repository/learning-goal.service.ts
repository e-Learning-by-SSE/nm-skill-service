import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { LoGoalDto } from './dto/export/lo-goal.dto';
import { LoGoalCreationDto } from './dto/lo-goal-creation.dto';
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

  async showGoal(goalId: string) {
    return this.getGoal(goalId);
  }

  async addGoal(userId: string, repositoryId: string, dto: LoGoalCreationDto) {
    // Check if repository exists and is owned by user
    await this.loRepositoryService.loadRepositoryForModification(userId, repositoryId);

    const inputData: Prisma.LearningGoalCreateInput = {
      name: dto.name,
      loRepository: {
        connect: {
          id: repositoryId,
        },
      },
    };

    if (dto.competencies.length >= 0) {
      inputData.lowLevelGoals = {
        connect: dto.competencies.map((c) => ({ id: c })),
      };
    }

    if (dto.uberCompetencies.length >= 0) {
      inputData.highLevelGoals = {
        connect: dto.uberCompetencies.map((uc) => ({ id: uc })),
      };
    }

    const newGoal = await this.db.learningGoal.create({
      data: inputData,
    });

    return LoGoalDto.createFromDao(newGoal);
  }
}
