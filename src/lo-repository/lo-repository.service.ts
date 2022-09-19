import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LoRepositoryDto, LoRepositoryListDto, ShallowLoRepositoryDto } from './dto';

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
      throw new NotFoundException('Specified repository not found: ' + repositoryId);
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
}
