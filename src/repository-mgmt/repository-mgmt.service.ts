import { PrismaService } from 'src/prisma/prisma.service';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { CompetenceCreationDto } from './dto/competence-creation.dto';
import { RepositoryCreationDto } from './dto/repository-creation.dto';

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

  /**
   * Adds a new competence to a specified repository
   * @param userId The ID of the user who wants to create a competence at one of his repositories
   * @param dto Specifies the competence to be created and the repository at which it shall be created
   * @returns The newly created competence
   */
  async createCompetence(userId: string, dto: CompetenceCreationDto) {
    // Add default value manually, which should be done by the DTO
    if (dto.repository.version == null) {
      dto.repository.version = '';
    }

    // Retrieve the repository, at which the competence shall be stored to
    const repository = await this.db.repository.findUnique({
      where: {
        userId_name_version: {
          userId: userId,
          name: dto.repository.name,
          version: dto.repository.version,
        },
      },
    });

    if (repository == null) {
      throw new NotFoundException('Specified repository not found: ' + dto.repository);
    }

    // Create and return competence
    try {
      const competence = await this.db.competence.create({
        data: {
          repositoryId: repository.id,
          skill: dto.skill,
          level: dto.level,
          description: dto.description,
        },
      });

      return competence;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Concept already present in specified repository');
        }
      }
      throw error;
    }
  }
}
