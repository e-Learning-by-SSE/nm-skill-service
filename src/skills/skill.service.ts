import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Skill } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import {
  SkillCreationDto,
  ResolvedSkillDto,
  SkillRepositoryCreationDto,
  SkillListDto,
  SkillRepositoryDto,
  SkillRepositoryListDto,
  ResolvedSkillRepositoryDto,
  SkillDto,
  ResolvedSkillListDto,
} from './dto';
import { UnresolvedSkillRepositoryDto } from './dto/unresolved-skill-repository.dto';

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 */
@Injectable()
export class SkillMgmtService {
  constructor(private db: PrismaService) {}

  public async findSkillRepositories(
    page: number | null,
    pageSize: number | null,
    owner: string | null,
    name: string | Prisma.StringFilter | null,
    version: string | null,
  ) {
    const query: Prisma.SkillMapFindManyArgs = {};

    // By default all parameters of WHERE are combined with AND:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
    if (owner || name || version) {
      query.where = {
        owner: owner ?? undefined,
        name: name ?? undefined,
        version: version ?? undefined,
      };
    } else {
      // Ensure pagination if no filters are defined
      if (page == null || pageSize == null) {
        page = page ?? 0;
        pageSize = pageSize ?? 10;
      }
    }
    if (page !== null && page >= 0 && pageSize !== null && pageSize > 0) {
      query.skip = page * pageSize;
      query.take = pageSize;
    }

    const repositories = await this.db.skillMap.findMany(query);

    const repoList = new SkillRepositoryListDto();
    repoList.repositories = repositories.map((repository) => SkillRepositoryDto.createFromDao(repository));

    return repoList;
  }

  /**
   * Returns a list of all repositories owned by the specified user.
   * Won't include any information about nested skills.
   * @param ownerId The owner of the repositories
   * @returns The list of his repositories
   */
  async listSkillMaps(ownerId: string) {
    return this.findSkillRepositories(null, null, ownerId, null, null);
  }

  async createRepository(dto: SkillRepositoryCreationDto) {
    try {
      const repository = await this.db.skillMap.create({
        data: {
          owner: dto.owner,
          name: dto.name,
          version: dto.version,

          description: dto.description,
        },
      });

      return SkillRepositoryDto.createFromDao(repository);
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
   * Loads a repository by ID with the specified parameters.
   * Allows most options, other functions are based on this one
   * @param owner Should only be specified if the repository is opened for writing.
   *              Specifying an owner will ensure that the repository is owned by the specified user and throw an error otherwise.
   * @param repositoryId The ID of the repository to be loaded
   * @param includeSkills Specifies if all skills of the repository shall be included in the result
   * @param args Additional arguments to be passed to the Prisma query
   * @returns The loaded repository or throws an error if the repository does not exist or the user is not the owner
   */
  public async getSkillRepository(
    owner: string | null,
    repositoryId: string,
    includeSkills = false,
    args?: Prisma.SkillMapFindUniqueArgs,
  ) {
    // Retrieve the repository, at which the skill shall be stored to
    const repository = await this.db.skillMap.findUnique({
      ...args,
      where: {
        id: repositoryId,
      },
      include: {
        skills: includeSkills,
      },
    });

    if (!repository) {
      throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
    }

    if (owner && repository.owner !== owner) {
      throw new ForbiddenException(`Specified repository "${repositoryId}" is not owned by user: ${owner}`);
    }
    return repository;
  }

  public async loadSkillRepository(repositoryId: string) {
    const repository = await this.getSkillRepository(null, repositoryId, true);
    const result: UnresolvedSkillRepositoryDto = {
      ...SkillRepositoryDto.createFromDao(repository),
      skills: repository.skills.map((c) => c.id),
    };

    return result;
  }

  public async loadResolvedSkillRepository(repositoryId: string) {
    const repository = await this.getSkillRepository(null, repositoryId, false);
    const result = ResolvedSkillRepositoryDto.createFromDao(repository);

    // Search for skills of that repository that do not have a parent -> top-level skills
    const topLevelSkills = await this.db.skill.findMany({
      where: {
        repositoryId: repositoryId,
        parentSkills: {
          none: {},
        },
      },
      include: {
        nestedSkills: true,
      },
    });

    // Load all top-level skills
    const resolved = new Map<string, ResolvedSkillDto>();
    for (const skill of topLevelSkills) {
      result.skills.push(await this.loadSkill(skill, resolved));
    }

    return result;
  }

  /**
   * Adds a new skill to a specified repository
   * @param dto Specifies the skill to be created and the repository at which it shall be created
   * @returns The newly created skill
   */
  async createSkill(skillRepositoryId: string, dto: SkillCreationDto) {
    // Checks that the user is the owner of the repository / repository exists
    await this.getSkillRepository(dto.owner, skillRepositoryId);

    // Create and return skill
    try {
      const skill = await this.db.skill.create({
        data: {
          repositoryId: skillRepositoryId,
          name: dto.name,
          level: dto.level,
          description: dto.description,
        },
      });

      return SkillDto.createFromDao(skill);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Skill already exists in specified repository');
        }
      }
      throw error;
    }
  }

  private async loadSkill(
    skill: Skill & {
      nestedSkills: Skill[];
    },
    resolved = new Map<string, ResolvedSkillDto>(),
  ) {
    const result = ResolvedSkillDto.createFromDao(skill);
    resolved.set(skill.id, result);

    // Add nested skills
    for (const child of skill.nestedSkills) {
      // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
      result.nestedSkills.push(await this.getNestedSkill(child.id, resolved));
    }

    return result;
  }

  public async getSkill(skillId: string) {
    const dao = await this.db.skill.findUnique({
      where: {
        id: skillId,
      },
      include: {
        nestedSkills: true,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    const skill = SkillDto.createFromDao(dao);
    skill.nestedSkills = dao.nestedSkills.map((c) => c.id);

    return skill;
  }

  public async getResolvedSkill(skillId: string) {
    const dao = await this.db.skill.findUnique({
      where: {
        id: skillId,
      },
      include: {
        nestedSkills: true,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    return this.loadSkill(dao);
  }

  /**
   * Recursive function to resolve nested sills.
   *
   * **Warning:** This won't prevent for endless loops if skill tree is not acyclic!
   * @param skillId The ID of the skill to be resolved
   * @param resolved A map of already resolved skills, to prevent duplicate resolving
   * @returns The resolved skill
   */
  private async getNestedSkill(skillId: string, resolved: Map<string, ResolvedSkillDto>) {
    const resolvedSkill = resolved.get(skillId);
    let result: ResolvedSkillDto;

    if (resolvedSkill) {
      result = resolvedSkill;
    } else {
      const dao = await this.db.skill.findUnique({
        where: {
          id: skillId,
        },
        include: {
          nestedSkills: true,
        },
      });

      // Unsure if we need this: Due to foreign key constraints, this should not be possible
      if (!dao) {
        throw new NotFoundException(`Specified skill not found: ${skillId}`);
      }

      const dto = ResolvedSkillDto.createFromDao(dao);
      resolved.set(dao.id, dto);
      // Add nested skills
      for (const child of dao.nestedSkills) {
        // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
        dto.nestedSkills.push(await this.getNestedSkill(child.id, resolved));
      }

      result = dto;
    }

    return result;
  }

  public async searchSkills(
    page: number | null,
    pageSize: number | null,
    name: string | Prisma.StringFilter | null,
    level: number | null,
    repositoryId: string | null,
  ) {
    const query: Prisma.SkillFindManyArgs = {};

    // By default all parameters of WHERE are combined with AND:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
    if (name || repositoryId) {
      query.where = {
        name: name ?? undefined,
        repositoryId: repositoryId ?? undefined,
      };
      // Consider level only if at least also a name was specified
      if (name) {
        query.where.level = level ?? undefined;
      }
    } else {
      // Ensure pagination if no filters are defined
      if (page == null || pageSize == null) {
        page = page ?? 0;
        pageSize = pageSize ?? 10;
      }
    }
    if (page && page >= 0 && pageSize && pageSize > 0) {
      query.skip = page * pageSize;
      query.take = pageSize;
    }
    const skills = await this.db.skill.findMany({
      ...query,
      include: {
        nestedSkills: true,
      },
    });

    if (!skills) {
      throw new NotFoundException('Can not find any skills');
    }

    // Resolve nested skills if there are any
    const skillList = new SkillListDto();
    for (const skill of skills) {
      const child = SkillDto.createFromDao(skill);
      // Add nested skills
      child.nestedSkills = skill.nestedSkills.map((c) => c.id);

      skillList.skills.push(child);
    }

    return skillList;
  }

  public async searchSkillsResolved(
    page: number | null,
    pageSize: number | null,
    name: string | Prisma.StringFilter | null,
    level: number | null,
    repositoryId: string | null,
  ) {
    const query: Prisma.SkillFindManyArgs = {};

    // By default all parameters of WHERE are combined with AND:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
    if (name || repositoryId) {
      query.where = {
        name: name ?? undefined,
        repositoryId: repositoryId ?? undefined,
      };
      // Consider level only if at least also a name was specified
      if (name) {
        query.where.level = level ?? undefined;
      }
    } else {
      // Ensure pagination if no filters are defined
      if (page == null || pageSize == null) {
        page = page ?? 0;
        pageSize = pageSize ?? 10;
      }
    }
    if (page && page >= 0 && pageSize && pageSize > 0) {
      query.skip = page * pageSize;
      query.take = pageSize;
    }
    const skills = await this.db.skill.findMany({
      ...query,
      include: {
        nestedSkills: true,
      },
    });

    if (!skills) {
      throw new NotFoundException('Can not find any skills');
    }

    // Resolve nested skills if there are any
    const skillList = new ResolvedSkillListDto();
    const resolved = new Map<string, ResolvedSkillDto>();
    for (const skill of skills) {
      // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
      skillList.skills.push(await this.loadSkill(skill, resolved));
    }

    return skillList;
  }
}
