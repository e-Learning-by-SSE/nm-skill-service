import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
    LoRepositoryCreationDto,
    LoRepositoryDto,
    LoRepositoryListDto,
    LoRepositoryModifyDto,
    ShallowLoRepositoryDto,
} from './dto';
import { LearningObjectDto } from './dto/export/learning-object.dto';
import { LearningObjectCreationDto } from './dto/learning-object-creation.dto';
import { LearningObjectModificationDto } from './dto/learning-object-modification.dto';

@Injectable()
export class LoRepositoryService {
  constructor(private db: PrismaService) {}

  async listRepositories() {
    const result = new LoRepositoryListDto();
    const loRepositories = await this.db.loRepository.findMany();

    for (const repository of loRepositories) {
      result.repositories.push(
        new ShallowLoRepositoryDto(repository.id, repository.name, repository.userId, repository.description),
      );
    }

    return result;
  }

  async getRepository(repositoryId: string, showLearningObjects: boolean, showGoals: boolean) {
    const loRepository = await this.db.loRepository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        learningObjects: showLearningObjects,
        learningGoals: showGoals,
      },
    });

    if (!loRepository) {
      throw new NotFoundException(`Specified LO-Repository not found: ${repositoryId}`);
    }

    return loRepository;
  }

  async loadRepository(repositoryId: string) {
    const loRepository = await this.getRepository(repositoryId, true, false);

    const result = new LoRepositoryDto(
      loRepository.id,
      loRepository.name,
      loRepository.userId,
      loRepository.description,
    );
    for (const lo of loRepository.learningObjects) {
      result.learningObjects.push(lo.id);
    }

    return result;
  }

  async createNewRepository(userId: string, dto: LoRepositoryCreationDto) {
    try {
      const newRepository = await this.db.loRepository.create({
        data: {
          name: dto.name,
          description: dto.description,
          userId: userId,
        },
      });

      return ShallowLoRepositoryDto.createFromDao(newRepository);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('LO-Repository with specified name already owned');
        }
      }
      throw error;
    }
  }

  /**
   * Loads the specified repository and checks if it is owned by the specified user.
   * @param userId The owner of the repository, who is allowed to make modifications.
   * @param repositoryId The ID of the specified repository to open.
   * @returns The repository object or an exception if the repository doesn't exist or if it is owned by somebody else.
   */
  private async loadRepositoryForModification(userId: string, repositoryId: string) {
    const repository = await this.db.loRepository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    // Check ownership
    if (!repository) {
      throw new NotFoundException(`Specified LO-Repository not found: ${repositoryId}`);
    }
    if (repository.userId != userId) {
      throw new ForbiddenException('Specified LO-Repository owned by another user');
    }

    return repository;
  }

  /**
   * Loads the specified learning object and checks if it is owned by the specified user.
   * @param userId The owner of the repository, who is allowed to make modifications.
   * @param repositoryId The ID of the specified repository to open.
   * @returns The repository object or an exception if the repository doesn't exist or if it is owned by somebody else.
   */
  private async loadLearningObjectForModification(
    userId: string,
    repositoryId: string,
    learningObjectId: string,
    includeCompetencies = true,
  ) {
    // Check if repository is owned by user
    await this.loadRepositoryForModification(userId, repositoryId);

    // Check if learning object belongs to specified repository and is owned by user
    const learningObject = await this.db.learningObject.findUnique({
      where: {
        id: learningObjectId,
      },
      include: {
        requiredCompetencies: includeCompetencies,
        requiredUeberCompetencies: includeCompetencies,
        offeredCompetencies: includeCompetencies,
        offeredUeberCompetencies: includeCompetencies,
      },
    });

    // Check ownership
    if (!learningObject) {
      throw new NotFoundException(`Specified Learning Object not found: ${repositoryId}`);
    }
    if (learningObject.loRepositoryId != repositoryId) {
      throw new ForbiddenException('Specified Learning Object belongs to another LO-Repository');
    }

    return learningObject;
  }

  async modifyRepository(userId: string, repositoryId: string, dto: LoRepositoryModifyDto) {
    let repository = await this.loadRepositoryForModification(userId, repositoryId);

    // Determine data to change
    const changeData: any = {};
    if (dto.name && dto.name !== repository.name) {
      // Name must not be null and different
      changeData['name'] = dto.name;
    }
    // Make description comparable (same type definition)
    const newDescription = dto.description ?? null;
    if (newDescription !== repository.description) {
      // New description should be changed (can also be set to undefined)
      changeData['description'] = dto.description ?? null;
    }

    // Apply update, only if there is a (valid) change
    if (Object.keys(changeData).length > 0) {
      repository = await this.db.loRepository.update({
        where: {
          id: repository.id,
        },
        data: changeData,
      });
      return new LoRepositoryDto(repository.id, repository.name, repository.userId, repository.description);
    }

    throw new BadRequestException('Nothing to change.');
  }

  async loadLearningObject(learningObjectId: string) {
    const lo = await this.db.learningObject.findUnique({
      where: {
        id: learningObjectId,
      },
      include: {
        requiredCompetencies: true,
        requiredUeberCompetencies: true,
        offeredCompetencies: true,
        offeredUeberCompetencies: true,
      },
    });

    if (!lo) {
      throw new NotFoundException(`Specified Learning Object not found: ${learningObjectId}`);
    }

    return LearningObjectDto.createFromDao(lo);
  }

  async createLearningObject(userId: string, repositoryId: string, dto: LearningObjectCreationDto) {
    // Check if repository is owned by user
    await this.loadRepositoryForModification(userId, repositoryId);

    // Expand array of IDs to appropriate objects
    const reqCompetencies = dto.requiredCompetencies.map((i) => ({ id: i }));
    const reqUeberCompetencies = dto.requiredUeberCompetencies.map((i) => ({ id: i }));
    const offCompetencies = dto.offeredCompetencies.map((i) => ({ id: i }));
    const offUeberCompetencies = dto.offeredUeberCompetencies.map((i) => ({ id: i }));

    const newLo = await this.db.learningObject.create({
      data: {
        loRepositoryId: repositoryId,
        name: dto.name,
        description: dto.description,
        requiredCompetencies: {
          connect: reqCompetencies,
        },
        requiredUeberCompetencies: {
          connect: reqUeberCompetencies,
        },
        offeredCompetencies: {
          connect: offCompetencies,
        },
        offeredUeberCompetencies: {
          connect: offUeberCompetencies,
        },
      },
      include: {
        requiredCompetencies: true,
        requiredUeberCompetencies: true,
        offeredCompetencies: true,
        offeredUeberCompetencies: true,
      },
    });

    return LearningObjectDto.createFromDao(newLo);
  }

  async modifyLearningObject(
    userId: string,
    repositoryId: string,
    learningObjectId: string,
    dto: LearningObjectModificationDto,
  ) {
    const oldLo = await this.loadLearningObjectForModification(userId, repositoryId, learningObjectId);

    // Determine data to change
    const changeData: Prisma.LearningObjectUpdateInput = {};
    if (dto.name && dto.name !== oldLo.name) {
      // Name must not be null and different
      changeData.name = dto.name;
    }
    // Make description comparable (same type definition)
    const newDescription = dto.description ?? null;
    if (newDescription !== oldLo.description) {
      // New description should be changed (can also be set to undefined)
      changeData.description = dto.description ?? null;
    }

    // Determine relations to competencies to update
    changeData.requiredCompetencies = computeRelationUpdate(oldLo.requiredCompetencies, dto.requiredCompetencies);
    changeData.requiredUeberCompetencies = computeRelationUpdate(
      oldLo.requiredUeberCompetencies,
      dto.requiredUeberCompetencies,
    );
    changeData.offeredCompetencies = computeRelationUpdate(oldLo.offeredCompetencies, dto.offeredCompetencies);
    changeData.offeredUeberCompetencies = computeRelationUpdate(
      oldLo.offeredUeberCompetencies,
      dto.offeredUeberCompetencies,
    );

    if (Object.keys(changeData).length > 0) {
      const newLo = await this.db.learningObject.update({
        where: {
          id: learningObjectId,
        },
        data: changeData,
        include: {
          requiredCompetencies: true,
          requiredUeberCompetencies: true,
          offeredCompetencies: true,
          offeredUeberCompetencies: true,
        },
      });

      return LearningObjectDto.createFromDao(newLo);
    }
  }
}
