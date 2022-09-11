import { validate } from 'class-validator';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Competence, UeberCompetence } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { CompetenceCreationDto, RepositoryCreationDto, RepositoryDto, UeberCompetenceCreationDto } from './dto';
import { CompetenceDto } from './dto/competence.dto';
import { UeberCompetenceModificationDto } from './dto/ueber-competence-modification.dto';
import { UeberCompetenceDto } from './dto/ueber-competence.dto';

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
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
    console.log(dto);
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

  public async loadFullRepository(userId: string, repositoryId: string) {
    const repository = await this.getRepository(userId, repositoryId, true);
    // Object Destructuring & Property: https://stackoverflow.com/a/39333479
    const tmp: any = (({ id, name, taxonomy, description }) => ({ id, name, taxonomy, description }))(repository);
    tmp.competencies = new Array<CompetenceDto>();
    tmp.ueberCompetencies = new Array<UeberCompetenceDto>();
    const result = tmp as RepositoryDto;

    // Load all Competencies of Repository
    const competenceMap = new Map<string, CompetenceDto>();
    repository.competencies.forEach((c) => {
      // Convert DAO -> DTO
      const tmp: any = (({ id, skill, level }) => ({ id, skill, level }))(c);
      tmp.description = c.description ?? '';
      const competence = tmp as CompetenceDto;

      competenceMap.set(c.id, competence);
      result.competencies.push(competence);
    });

    // Load all Ueber-Competencies of Repository
    const ueberCompetenceMap = new Map<string, UeberCompetenceDto>();
    repository.uebercompetencies.forEach((uc) => {
      // Convert DAO -> DTO
      const tmp: any = (({ id, name }) => ({ id, name }))(uc);
      tmp.description = uc.description ?? '';
      tmp.nestedCompetencies = new Array(CompetenceDto);
      tmp.nestedUeberCompetencies = new Array(UeberCompetenceDto);
      const ueberCompetence = tmp as UeberCompetenceDto;

      ueberCompetenceMap.set(uc.id, ueberCompetence);
      result.ueberCompetencies.push(ueberCompetence);
    });

    // Resolve nested elements of all Ueber-Competencies
    await result.ueberCompetencies.forEach(async (uc) => {
      // Load relations from DB
      const tmp = await this.db.ueberCompetence.findUnique({
        where: {
          id: uc.id,
        },
        include: {
          subCompetences: true,
          subUeberCompetences: true,
          parentUeberCompetences: true,
        },
      });

      // Load all nested Competencies
      tmp?.subCompetences.forEach((child) => {
        const resolved = competenceMap.get(child.id);
        if (resolved) {
          uc.nestedCompetencies.push(resolved);
        }
      });
    });

    return result;
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

      return competence;
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

      return competence;
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
    if (dto.nestedCompetences) {
      dto.nestedCompetences.forEach(async (item) => {
        await this.loadCompetence(item, repositoryId);
      });
    }

    // Check that all competencies belong to this repository
    if (dto.nestedUeberCompetences) {
      dto.nestedUeberCompetences.forEach(async function (value) {
        await this.loadUeberCompetence(value, repositoryId);
      });
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
    const competencies = dto.nestedCompetences.map((i) => ({ id: i }));
    const ueberCompetencies = dto.nestedUeberCompetences.map((i) => ({ id: i }));

    // Apply upate
    const updatedUeberComp = this.db.ueberCompetence.update({
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
      },
    });

    return updatedUeberComp;
  }
}
