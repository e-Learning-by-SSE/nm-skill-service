import { identity } from 'rxjs';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computePageQuery, computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
   SkillCreationDto, SkillDto, SkillRepositorySearchDto, SkillListDto, SkillRepositoryDto, SkillRepositoryListDto, SkillRepositorySelectionDto 
} from './dto';


/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
@Injectable()
export class SkillMgmtService {
  constructor(private db: PrismaService) {}

  async findSkillRepositories(dto?: SkillRepositorySearchDto) {
    const query: Prisma.RepositoryFindManyArgs = computePageQuery(dto);
    const repositories = await this.db.repository.findMany(query);

    const repoList = new SkillRepositoryListDto();
    repoList.repositories = repositories.map((repository) => SkillRepositoryDto.createFromDao(repository));

    return repoList;
  }

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

    const repoList = new SkillRepositoryListDto();
    repoList.repositories = repositories.map((repository) => SkillRepositoryDto.createFromDao(repository));

    return repoList;
  }
/**
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

      return RepositoryDto.createFromDao(repository);
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

    if (!repository) {
      throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
    }

    if (repository.userId != userId) {
      throw new ForbiddenException('Repository owned by another user');
    }

    return repository;
  }

  public async loadRepository(userId: string, repositoryId: string) {
    const repository = await this.getRepository(userId, repositoryId, true);
    const result: UnresolvedRepositoryDto = {
      ...RepositoryDto.createFromDao(repository),
      competencies: repository.competencies.map((c) => c.id),
      ueberCompetencies: repository.uebercompetencies.map((uc) => uc.id),
    };

    return result;
  }

  public async loadResolvedRepository(userId: string, repositoryId: string) {
    const repository = await this.getRepository(userId, repositoryId, true);
    const result = ResolvedRepositoryDto.create(
      repository.id,
      repository.name,
      repository.version,
      repository.taxonomy,
      repository.description,
    );

    // Load all Competencies of Repository
    const competenceMap = new Map<string, CompetenceDto>();
    repository.competencies.forEach((c) => {
      // Convert DAO -> DTO
      const competence = CompetenceDto.createFromDao(c);

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

  async resolveUberCompetencies(repositoryId: string, dto: UberCompetenceResolveRequestDto) {
    // Retrieve the repository, at which the competence shall be stored to
    const repository = await this.db.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        competencies: true,
        uebercompetencies: true,
      },
    });

    if (!repository) {
      throw new NotFoundException('Specified repository not found: ' + repositoryId);
    }

    // Load all Competencies of Repository
    const competenceMap = new Map<string, CompetenceDto>();
    repository.competencies.forEach((c) => {
      // Convert DAO -> DTO
      const competence = CompetenceDto.createFromDao(c);

      competenceMap.set(c.id, competence);
    });

    // list of all (unique) resolved competencies
    const resultSet = new Set<CompetenceDto>();
    // First determine all UberCompetencies
    const unresolvedUCs = new Set<string>();
    const doneUCs = new Set<string>();
    for (const id of dto.uberCompetencies) {
      unresolvedUCs.add(id);
    }
    while (unresolvedUCs.size > 0) {
      const tmp = new Set(unresolvedUCs);
      unresolvedUCs.clear();

      for (const id of tmp) {
        doneUCs.add(id);
        const uc = await this.db.ueberCompetence.findUnique({
          where: {
            id: id,
          },
          include: {
            subCompetences: true,
            subUeberCompetences: true,
          },
        });

        if (uc) {
          // Store Competence
          uc.subCompetences.map((c) => c.id).map((i) => competenceMap.get(i));
          for (const nested of uc.subCompetences) {
            const competence = competenceMap.get(nested.id);
            if (competence) {
              resultSet.add(competence);
            }
          }

          // Consider UberCompetences for further resolving
          for (const nested of uc.subUeberCompetences) {
            const id = nested.id;
            if (!doneUCs.has(id) && !tmp.has(id)) {
              unresolvedUCs.add(id);
            }
          }
        }
      }
    }

    const result = new CompetenceListDto();
    result.competencies = Array.from(resultSet.values());
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
  /**
   * Adds a new competence to a specified repository
   * @param userId The ID of the user who wants to create a competence at one of his repositories
   * @param dto Specifies the competence to be created and the repository at which it shall be created
   * @returns The newly created competence
   */
  /**
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

    // Create new data
    const createData: Prisma.UeberCompetenceCreateArgs = {
      data: {
        repositoryId: repositoryId,
        name: dto.name,
        description: dto.description,
      },
      include: {
        subCompetences: true,
        subUeberCompetences: true,
        parentUeberCompetences: true,
      },
    };
    if (dto.nestedCompetencies) {
      createData.data.subCompetences = {
        connect: dto.nestedCompetencies.map((c) => ({ id: c })),
      };
    }
    if (dto.nestedUeberCompetencies) {
      createData.data.subUeberCompetences = {
        connect: dto.nestedUeberCompetencies.map((c) => ({ id: c })),
      };
    }

    try {
      const competence = await this.db.ueberCompetence.create(createData);
      return UnResolvedUeberCompetenceDto.createFromDao(competence);
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

  private async loadCompetence(competenceId: string, repositoryId: string | null) {
    const competence = await this.db.competence.findUnique({ where: { id: competenceId } });

    if (!competence) {
      throw new NotFoundException('Specified competence not found: ' + competenceId);
    }

    if (repositoryId) {
      if (competence.repositoryId != repositoryId) {
        throw new ForbiddenException('Competence belongs to another repository.');
      }
    }

    return competence;
  }

  public async getCompetence(competenceId: string) {
    const dao = await this.loadCompetence(competenceId, null);

    if (!dao) {
      throw new NotFoundException(`Specified competence not found: ${competenceId}`);
    }

    return CompetenceDto.createFromDao(dao);
  }

  async loadUeberCompetence(ueberCompetenceId: string, repositoryId: string | null, includeNested = false) {
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
      throw new NotFoundException(`Specified ueber-competence not found: ${ueberCompetenceId}`);
    }

    if (repositoryId) {
      if (ueberCompetence.repositoryId != repositoryId) {
        throw new ForbiddenException('Ueber-competence belongs to another repository.');
      }
    }

    return ueberCompetence;
  }

  public async getUberCompetence(uberCompetenceId: string) {
    const dao = await this.loadUeberCompetence(uberCompetenceId, null, true);

    return UnResolvedUeberCompetenceDto.createFromDao(dao);
  }

  async modifyUeberCompetence(userId: string, repositoryId: string, dto: UeberCompetenceModificationDto) {
    // Checks that the user is the owner of the repository
    await this.getRepository(userId, repositoryId);

    // Load ueber-competence to be changed and check that this belongs to specified repository
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

    // Determine data to change
    const changeData: any = {};
    // Determine relations to competencies to update
    let changedRelations = computeRelationUpdate(ueberCompetence.subCompetences, dto.nestedCompetencies);
    if (changedRelations) {
      changeData['subCompetences'] = changedRelations;
    }
    changedRelations = computeRelationUpdate(ueberCompetence.subUeberCompetences, dto.nestedUeberCompetencies);
    if (changedRelations) {
      changeData['subUeberCompetences'] = changedRelations;
    }

    if (Object.keys(changeData).length > 0) {
      // Apply update
      const updatedUeberComp = await this.db.ueberCompetence.update({
        where: { id: ueberCompetence.id },
        data: changeData,
        include: {
          subCompetences: true,
          subUeberCompetences: true,
          parentUeberCompetences: true,
        },
      });

      return UnResolvedUeberCompetenceDto.createFromDao(updatedUeberComp);
    }
  }
*/
}
