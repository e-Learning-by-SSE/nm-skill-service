import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import {
    LoRepositoryCreationDto,
    LoRepositoryDto,
    LoRepositoryListDto,
    LoRepositoryModifyDto,
    ShallowLoRepositoryDto,
} from './dto';
import { LearningObjectDto } from './dto/export/learning-object.dto';

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

  async loadRepository(repositoryId: string) {
    const loRepository = await this.db.loRepository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        learningObjects: true,
      },
    });

    if (!loRepository) {
      throw new NotFoundException('Specified LO-Repository not found: ' + repositoryId);
    }

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

      return new ShallowLoRepositoryDto(
        newRepository.id,
        newRepository.name,
        newRepository.userId,
        newRepository.description,
      );
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

  async modifyRepository(userId: string, repositoryId: string, dto: LoRepositoryModifyDto) {
    let repository = await this.db.loRepository.findUnique({
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

    // Determine data to change
    console.log(dto);
    console.log(repository);
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
    console.log(changeData);

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

    throw new RangeError('Nothing to change.');
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
      throw new NotFoundException('Specified Learning Object not found: ' + learningObjectId);
    }

    const result = new LearningObjectDto(lo.id, lo.loRepositoryId, lo.name, lo.description);
    for (const requirement of lo.requiredCompetencies) {
      result.requiredCompetencies.push(requirement.id);
    }
    for (const requirement of lo.requiredUeberCompetencies) {
      result.requiredUeberCompetencies.push(requirement.id);
    }
    for (const offered of lo.offeredCompetencies) {
      result.offeredCompetencies.push(offered.id);
    }
    for (const offered of lo.offeredUeberCompetencies) {
      result.offeredUeberCompetencies.push(offered.id);
    }
    return result;
  }
}
