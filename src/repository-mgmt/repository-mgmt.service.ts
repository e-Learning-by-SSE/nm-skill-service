import { PrismaService } from 'src/prisma/prisma.service';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { RepositoryCreationDto } from './dto/repository_creation.dto';

@Injectable()
export class RepositoryMgmtService {
  constructor(private db: PrismaService) {}

  async listRepositories(userId: string) {
    console.log(userId);
    const repositories = await this.db.repository.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(repositories);

    return { repositories: repositories };
  }

  async createRepository(userId: string, dto: RepositoryCreationDto) {
    try {
      const repository = await this.db.repository.create({
        data: {
          userId: userId,
          name: dto.name,
          version: dto.version,
          description: dto.description,
        },
      });

      return repository;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Repository with specified name and version already owned');
        }
      }
      throw error;
    }
  }
}
