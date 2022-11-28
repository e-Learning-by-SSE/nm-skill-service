import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GroupedLearningObjects, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
    LearningObjectGroupCreationDto,
    LearningObjectGroupDto,
    LoGoalDto,
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
        learningComposites: showLearningObjects,
        learningGoals: showGoals,
      },
    });

    if (!loRepository) {
      throw new NotFoundException(`Specified LO-Repository not found: ${repositoryId}`);
    }

    return loRepository;
  }

  async loadRepository(repositoryId: string) {
    const loRepository = await this.getRepository(repositoryId, true, true);
    const result = LoRepositoryDto.createFromDao(loRepository);

    // Handle Learning Objects:
    // - Non-nested are added to result DTO
    // - Nested elements are temporarily stored at a map
    const loList = await this.db.learningObject.findMany({
      where: {
        loRepositoryId: repositoryId,
      },
      include: {
        requiredCompetencies: true,
        offeredCompetencies: true,
        requiredUeberCompetencies: true,
        offeredUeberCompetencies: true,
        parentGroups: true,
      },
    });

    const nonNestedLOs = new Set(loList.filter((lo) => lo.parentGroups.length == 0).map((lo) => lo.id));
    const loMap: Map<LearningObjectDto, string[]> = new Map();

    // Convert Learning Objects and safe elements that should be grouped
    loList.forEach((dao) => {
      const dto = LearningObjectDto.createFromDao(dao);
      // Store only top-level elements in result DTO
      if (nonNestedLOs.has(dao.id)) {
        result.learningObjects.push(dto);
      } else {
        loMap.set(
          dto,
          dao.parentGroups.map((g) => g.id),
        );
      }
    });

    // Handle Learning Object Groups
    const groupDaoList = await this.db.groupedLearningObjects.findMany({
      where: {
        loRepositoryId: repositoryId,
      },
      include: {
        nestedLOs: true,
        nestedGroups: true,
        parentGroups: true,
      },
    });

    const groupDtos: Map<string, LearningObjectGroupDto> = new Map();
    const groupParents: Map<LearningObjectGroupDto, string[]> = new Map();
    for (const dao of groupDaoList) {
      const dto = LearningObjectGroupDto.createFromDao(dao);
      groupDtos.set(dto.id, dto);
      // Store only top-level elements in result DTO
      if (dao.parentGroups.length == 0) {
        result.learningObjectsGroups.push(dto);
      } else {
        groupParents.set(
          dto,
          dao.parentGroups.map((p) => p.id),
        );
      }
    }

    groupParents.forEach((parents, dto) => {
      parents.forEach((id) => {
        groupDtos.get(id)!.nestedGroups.push(dto);
      });
    });

    // After processing: Add Goals
    result.goals = loRepository.learningGoals.map((g) => LoGoalDto.createFromDao(g));

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
  async loadRepositoryForModification(userId: string, repositoryId: string) {
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

  async createLearningObjectGroup(userId: string, repositoryId: string, dto: LearningObjectGroupCreationDto) {
    // Check if repository is owned by user
    await this.loadRepositoryForModification(userId, repositoryId);

    // Create DB data object
    const data: Prisma.GroupedLearningObjectsCreateArgs = {
      data: {
        name: dto.name,
        loRepositoryId: repositoryId,
        description: dto.description ?? null,
      },
      include: {
        nestedGroups: true,
        nestedLOs: true,
      },
    };
    if (dto.nestedGroups && dto.nestedGroups.length > 0) {
      data.data.nestedGroups = {
        connect: dto.nestedGroups.map((g) => ({ id: g })),
      };
    }
    if (dto.nestedLearningObjects && dto.nestedLearningObjects.length > 0) {
      data.data.nestedLOs = {
        connect: dto.nestedLearningObjects.map((lo) => ({ id: lo })),
      };
    }

    try {
      const newGroup = await this.db.groupedLearningObjects.create(data);
      return LearningObjectGroupDto.createFromDao(newGroup);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException(`LO-Repository has already a group called: ${dto.name}`);
        }
      }
      throw error;
    }
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
