import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import {
    CompetenceCreationDto,
    CompetenceDto,
    RepositoryCreationDto,
    RepositoryListDto,
    ResolvedRepositoryDto,
    ResolvedUeberCompetenceDto,
    UeberCompetenceCreationDto,
    UeberCompetenceModificationDto,
} from './dto';
import { RepositoryDto } from './dto/repository-export/repository.dto';
import { UnresolvedRepositoryDto } from './dto/repository-export/unresolved-repository.dto';
import { UnResolvedUeberCompetenceDto } from './dto/repository-export/unresolved-ueber-competence.dto';

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
@Injectable()
export class RepositoryMgmtService {
  constructor(private db: PrismaService) {}

  /**
   * Returns a list of all repositories owned by the specified user.
   * Won't include any information about nested competencies.
   * @param userId The owner of the repositories
   * @returns The list of his repositories
   */
  async listRepositories(userId: string) {
    const repositories = await this.db.repository.findMany({
      where: {
        userId: userId,
      },
    });

    const repoList = new RepositoryListDto();
    repoList.repositories = repositories.map((repository) => this.mapRepositoryToDto(repository));

    return repoList;
  }

  private mapRepositoryToDto(repository: Repository): RepositoryDto {
    return {
      userId: repository.userId,
      id: repository.id,
      name: repository.name,
      version: repository.version,
      taxonomy: repository.taxonomy ?? undefined,
      description: repository.description ?? undefined,
    };
  }

  async createRepository(userId: string, dto: RepositoryCreationDto) {
    try {
      const repository = await this.db.repository.create({
        data: {
          userId: userId,
          name: dto.name,
          version: dto.version,
          description: dto.description,
          taxonomy: dto.taxonomy,
        },
      });

      return this.mapRepositoryToDto(repository);
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

  public async getRepository(userId: string, repositoryId: string, includeCompetencies = false) {
    // Retrieve the repository, at which the competence shall be stored to
    const repository = await this.db.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        competencies: includeCompetencies,
        uebercompetencies: includeCompetencies,
      },
    });

    if (repository == null) {
      throw new NotFoundException('Specified repository not found: ' + repositoryId);
    }

    if (repository.userId != userId) {
      throw new ForbiddenException('Repository owned by another user');
    }

    return repository;
  }

  public async loadRepository(userId: string, repositoryId: string) {
    const repository = await this.getRepository(userId, repositoryId, true);
    const result: UnresolvedRepositoryDto = {
      ...this.mapRepositoryToDto(repository),
      competencies: repository.competencies.map((c) => c.id),
      ueberCompetencies: repository.uebercompetencies.map((uc) => uc.id),
    };

    return result;
  }

  public async loadResolvedRepository(userId: string, repositoryId: string) {
    const repository = await this.getRepository(userId, repositoryId, true);
    // Object Destructuring & Property: https://stackoverflow.com/a/39333479
    const tmp: any = (({ id, name, taxonomy, description }) => ({ id, name, taxonomy, description }))(repository);
    tmp.competencies = <CompetenceDto[]>[];
    tmp.ueberCompetencies = <ResolvedUeberCompetenceDto[]>[];
    const result = tmp as ResolvedRepositoryDto;

    // Load all Competencies of Repository
    const competenceMap = new Map<string, CompetenceDto>();
    repository.competencies.forEach((c) => {
      // Convert DAO -> DTO
      const competence: CompetenceDto = (({ id, skill, level }) => ({
        id,
        skill,
        level,
        description: c.description ?? '',
      }))(c);

      competenceMap.set(c.id, competence);
      result.competencies.push(competence);
    });

    // Load all Ueber-Competencies of Repository
    const ueberCompetenceMap = new Map<string, ResolvedUeberCompetenceDto>();
    repository.uebercompetencies.forEach((uc) => {
      // Convert DAO -> DTO
      const tmp: any = (({ id, name }) => ({ id, name }))(uc);
      tmp.description = uc.description ?? '';
      tmp.nestedCompetencies = <CompetenceDto[]>[];
      tmp.nestedUeberCompetencies = <ResolvedUeberCompetenceDto[]>[];
      const ueberCompetence = tmp as ResolvedUeberCompetenceDto;

      ueberCompetenceMap.set(uc.id, ueberCompetence);
      result.ueberCompetencies.push(ueberCompetence);
    });

    // Runs all asynchronous functions in parallel and waits for the result: https://stackoverflow.com/a/37576787
    await Promise.all(
      result.ueberCompetencies.map(async (uc) => {
        await this.resolveUberCompetence(uc, competenceMap, ueberCompetenceMap);
      }),
    );

    return result;
  }

  private async resolveUberCompetence(
    uc: ResolvedUeberCompetenceDto,
    competenceMap: Map<string, CompetenceDto>,
    ueberCompetenceMap: Map<string, ResolvedUeberCompetenceDto>,
  ) {
    // Load relations from DB
    const tmp = await this.db.ueberCompetence.findUnique({
      where: {
        id: uc.id,
      },
      include: {
        subCompetences: true,
        subUeberCompetences: true,
        // Avoid infinite circles
        parentUeberCompetences: false,
      },
    });

    if (tmp) {
      // Load all nested Competences
      tmp.subCompetences.forEach((child) => {
        const resolved = competenceMap.get(child.id);
        if (resolved) {
          uc.nestedCompetencies.push(resolved);
        }
      });

      // Load all nested Ueber-Competences
      for (const child of tmp.subUeberCompetences) {
        const resolved = ueberCompetenceMap.get(child.id);
        if (resolved) {
          uc.nestedUeberCompetencies.push(resolved);
        }
      }
    }
  }

  /**
   * Adds a new competence to a specified repository
   * @param userId The ID of the user who wants to create a competence at one of his repositories
   * @param dto Specifies the competence to be created and the repository at which it shall be created
   * @returns The newly created competence
   */
  async createCompetence(userId: string, repositoryId: string, dto: CompetenceCreationDto) {
    // Checks that the user is the owner of the repository / repository exists
    await this.getRepository(userId, repositoryId);

    // Create and return competence
    try {
      const competence = await this.db.competence.create({
        data: {
          repositoryId: repositoryId,
          skill: dto.skill,
          level: dto.level,
          description: dto.description,
        },
      });

      return competence as CompetenceDto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Competence already exists in specified repository');
        }
      }
      throw error;
    }
  }

  async createUeberCompetence(userId: string, repositoryId: string, dto: UeberCompetenceCreationDto) {
    // Checks that the user is the owner of the repository
    await this.getRepository(userId, repositoryId);

    // Create and return competence
    try {
      const competence = await this.db.ueberCompetence.create({
        data: {
          repositoryId: repositoryId,
          name: dto.name,
          description: dto.description,
        },
      });

      const result: UnResolvedUeberCompetenceDto = {
        id: competence.id,
        name: competence.name,
        description: competence.description ?? undefined,
        nestedCompetencies: [],
        nestedUeberCompetencies: [],
        parents: [],
      };
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Competence already exists in specified repository');
        }
      }
      throw error;
    }
  }

  private async loadCompetence(competenceId: string, repositoryId?: string) {
    const competence = await this.db.competence.findUnique({ where: { id: competenceId } });

    if (!competence) {
      throw new NotFoundException('Specified competence  not found: ' + competenceId);
    }

    if (repositoryId) {
      if (competence.repositoryId != repositoryId) {
        throw new ForbiddenException('Competence belongs to another repository.');
      }
    }

    return competence;
  }

  async loadUeberCompetence(ueberCompetenceId: string, repositoryId?: string, includeNested = false) {
    const ueberCompetence = await this.db.ueberCompetence.findUnique({
      where: {
        id: ueberCompetenceId,
      },
      include: {
        subCompetences: includeNested,
        subUeberCompetences: includeNested,
      },
    });

    if (!ueberCompetence) {
      throw new NotFoundException('Specified ueber-competence  not found: ' + ueberCompetenceId);
    }

    if (repositoryId) {
      if (ueberCompetence.repositoryId != repositoryId) {
        throw new ForbiddenException('Ueber-competence belongs to another repository.');
      }
    }

    return ueberCompetence;
  }

  async modifyUeberCompetence(userId: string, repositoryId: string, dto: UeberCompetenceModificationDto) {
    // Checks that the user is the owner of the repository
    await this.getRepository(userId, repositoryId);

    // Load ueber-competence to be changed and check that this belongs to specifed repository
    const ueberCompetence = await this.loadUeberCompetence(dto.ueberCompetenceId, repositoryId, true);

    // Check that all competencies belong to this repository
    if (dto.nestedCompetencies) {
      await Promise.all(
        dto.nestedCompetencies.map(async (c) => {
          await this.loadCompetence(c, repositoryId);
        }),
      );
    }

    // Check that all competencies belong to this repository
    if (dto.nestedUeberCompetencies) {
      await Promise.all(
        dto.nestedUeberCompetencies.map(async (uc) => {
          await this.loadUeberCompetence(uc, repositoryId);
        }),
      );
    }

    // Old records needs to be deleted first
    // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#disconnect-all-related-records
    await this.db.ueberCompetence.update({
      where: { id: ueberCompetence.id },
      data: {
        subCompetences: {
          set: [],
        },
        subUeberCompetences: {
          set: [],
        },
      },
    });

    // Map array of ids to object array
    const competencies = dto.nestedCompetencies?.map((i) => ({ id: i }));
    const ueberCompetencies = dto.nestedUeberCompetencies?.map((i) => ({ id: i }));

    // Apply upate
    const updatedUeberComp = await this.db.ueberCompetence.update({
      where: { id: ueberCompetence.id },
      data: {
        subCompetences: {
          connect: competencies,
        },
        subUeberCompetences: {
          connect: ueberCompetencies,
        },
      },
      include: {
        subCompetences: true,
        subUeberCompetences: true,
        parentUeberCompetences: true,
      },
    });

    const result: UnResolvedUeberCompetenceDto = {
      id: ueberCompetence.id,
      name: ueberCompetence.name,
      description: ueberCompetence.description ?? undefined,
      nestedCompetencies: updatedUeberComp.subCompetences.map((c) => c.id),
      nestedUeberCompetencies: updatedUeberComp.subUeberCompetences.map((uc) => uc.id),
      parents: updatedUeberComp.parentUeberCompetences.map((p) => p.id),
    };
    return result;
  }
}
