import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { LearningPathCreationDto, LearningPathDto, LearningPathListDto } from './dto';

/**
 * Service that manages the creation/update/deletion
 * @author Wenzel
 */
@Injectable()
export class LearningPathMgmtService {
  constructor(private db: PrismaService) {}

  /**
   * Adds a new learningPath
   * @param userId The ID of the user who wants to create a learningPath 
   * @param dto Specifies the learningPath to be created 
   * @returns The newly created learningPath

   */
  async createLearningPath(dto: LearningPathCreationDto) {
    // Create and return learningPath
    try {
      const learningPath = await this.db.learningPath.create({
        data: {
          title: dto.title,
          description: dto.description,
          goals: {
            create: dto.goals.map((goal) => ({
              title: goal.title,
              description: goal.description,
              targetAudience: goal.targetAudience,
              requirements: {
                connect: goal.requirements.map((requirement) => ({ id: requirement.id })),
              },
              pathGoals: {
                connect: goal.pathGoals.map((goal) => ({ id: goal.id })),
              },
            })),
          },
        },
        include: {
          goals: true,
        },
      });

      return LearningPathDto.createFromDao(learningPath);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('LearningPath already exists');
        }
      }
      throw error;
    }
  }

  public async getLearningPath(learningPathId: string) {
    const dao = await this.db.learningPath.findUnique({
      where: { id: learningPathId },
      include: { goals: true },
    });

    if (!dao) {
      throw new NotFoundException(`Specified learningPath not found: ${learningPathId}`);
    }

    return LearningPathDto.createFromDao(dao);
  }

  public async loadAllLearningPaths() {
    const learningPaths = await this.db.learningPath.findMany({ include: { goals: true } });

    if (!learningPaths) {
      throw new NotFoundException('Can not find any learningPaths');
    }

    const learningPathList = new LearningPathListDto();
    learningPathList.learningPaths = learningPaths.map((learningPath) => LearningPathDto.createFromDao(learningPath));

    return learningPaths;
  }
}
