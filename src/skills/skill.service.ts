import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
import { el, sk } from '@faker-js/faker';

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 */
@Injectable()
export class SkillMgmtService {
  constructor(private db: PrismaService) {
    db = db;
  }

  /**
   * Retrieve all skills from the database, including their nestedSkills and parentSkills,
   * and map them to SkillDto objects while maintaining the skill hierarchy.
   * @returns {SkillListDto} A SkillListDto containing the complete list of skills.
   * @throws {NotFoundException} If no skills are found in the database.
   */
  async loadAllSkills() {
    // Retrieve skills from the database, including nestedSkills and parentSkills

    const skills = await this.db.skill.findMany({
      include: {
        nestedSkills: true,
        parentSkills: true,
      },
    });
    // Check if no skills were found, and throw an exception if so
    if (skills.length==0) {
      throw new NotFoundException('Can not find any skills');
    }
    // Create a SkillListDto instance to store the list of skills
    const skillList = new SkillListDto();

    // Map the retrieved skills to SkillDto objects and include nestedSkills and parentSkills

    skillList.skills = skills.map((skill) => SkillDto.createFromDao(skill, skill.nestedSkills, skill.parentSkills));

    // Return the skillList containing the skills hierarchy
    return skillList;
  }

  /**
   * getCommonElements
   */
  public getCommonElements(arrayA: string[], arrayB: string[]): string[] {
    // Filter elements that are present in both arrays
    return arrayA.filter((elementA) => arrayB.includes(elementA));
  }

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
        ownerId: owner ?? undefined,
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
          name: dto.name,
          version: dto.version,
          access_rights: dto.access_rights,
          description: dto.description,
          ownerId: dto.ownerId,
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

  async checkIfSkillUsedInLearningUnits(skillId: string) {
    const learningUnitsWithSkill = await this.db.learningUnit.findMany({
      where: {
        OR: [
          {
            requirements: {
              some: {
                id: skillId,
              },
            },
          },
          {
            teachingGoals: {
              some: {
                id: skillId,
              },
            },
          },
        ],
      },
    });

    return learningUnitsWithSkill.length > 0;
  }

  async deleteRepository(repositoryId: string) {
    const dao = await this.db.skillMap.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        skills: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
    }
    const skillsInRepo = dao.skills.map((skill) => skill.id);

    // Use Promise.all to await all the queries for each skill
    await Promise.all(
      skillsInRepo.map(async (element) => {
        const skillsUsedInLearningUnits = await this.db.learningUnit.findMany({
          where: {
            OR: [
              {
                requirements: {
                  some: {
                    id: element,
                  },
                },
              },
              {
                teachingGoals: {
                  some: {
                    id: element,
                  },
                },
              },
            ],
          },
          select: {
            id: true,
          },
        });

        if (skillsUsedInLearningUnits.length > 0) {
          // If any skill is used in a learning unit, throw an error
          throw new ForbiddenException(
            `Specified repository with id: ${repositoryId} can not be deleted, some skills are part of a Learning Unit`,
          );
        }
      }),
    );
    await this.db.skill.deleteMany({
      where: {
        id: {
          in: skillsInRepo,
        },
      },
    });

    const deletedRepo = await this.db.skillMap.delete({
      where: {
        id: repositoryId,
      },
    });

    if (!deletedRepo) {
      throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
    }

    return deletedRepo;
  }


  
  async adaptRepository(dto: SkillRepositoryDto) {
    const dao = await this.db.skillMap.update({
      where: {
        id: dto.id,
      },
      data: {
        access_rights: dto.access_rights,
        description: dto.description,
        name: dto.name,
        taxonomy: dto.taxonomy,
        version: dto.version,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified repositroy not found: ${dto.id}`);
    }

    return dao;
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

    if (owner && repository.ownerId !== owner) {
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
      result.skills.push(await this.loadNestedSkill(skill, resolved));
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
      const nestedSkills = dto.nestedSkills || [];
      const skill = await this.db.skill.create({
        data: {
          repositoryId: skillRepositoryId,
          name: dto.name,
          level: dto.level,
          description: dto.description,
          nestedSkills: {
            connect: nestedSkills.map((nestedSkillId) => ({ id: nestedSkillId })),
          },
        },
        include: {
          nestedSkills: true,
          parentSkills: true, // Include nestedSkills in the response
        },
      });
      return SkillDto.createFromDao(skill, skill.nestedSkills);
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

  private async loadNestedSkill(
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
        parentSkills: true,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    const skill = SkillDto.createFromDao(dao, dao.nestedSkills);
    skill.nestedSkills = dao.nestedSkills.map((c) => c.id);
    skill.parentSkills = dao.parentSkills.map((sk) => sk.id);
    return skill;
  }

  public async getResolvedSkill(skillId: string) {
    const dao = await this.db.skill.findUnique({
      where: {
        id: skillId,
      },
      include: {
        nestedSkills: true,
        parentSkills: true,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    return this.loadNestedSkill(dao);
  }
  public async deleteSkillWithoutCheck(skillId: string) {
    const dao = await this.db.skill.delete({
      where: {
        id: skillId,
      },
    });

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    return dao;
  }
  /**
   * Recursive function to resolve nested sills.
   *
   * **Warning:** This won't prevent for endless loops if skill tree is not acyclic!
   * @param skillId The ID of the skill to be resolved
   * @param resolved A map of already resolved skills, to prevent duplicate resolving
   * @returns The resolved skill
   */
  public async getNestedSkill(skillId: string, resolved: Map<string, ResolvedSkillDto>) {
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
      const child = SkillDto.createFromDao(skill, skill.nestedSkills);
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
      skillList.skills.push(await this.loadNestedSkill(skill, resolved));
    }

    return skillList;
  }

  async deleteSkillWithCheck(skillId: string): Promise<void> {
    // Check if the skill is already in use

    const isUsed = await this.isSkillUsed(skillId);
    if (isUsed) {
      throw new BadRequestException('Skill is already used and cannot be deleted.');
    }

    // Retrieve all children of this skill
    const childSkills = await this.getChildSkills(skillId);
    let childIsUsed = false;
    // Check if any Child is used i a Learning Unit
    for (const childSkill of childSkills) {
      if (await this.isSkillUsed(childSkill.id)) {
        childIsUsed = true;
      }
    }
    if (childIsUsed) {
      throw new BadRequestException('Child of Skill is already used and cannot be deleted.');
    }
    // Recursively delete children
    for (const childSkill of childSkills) {
      await this.deleteSkillRecursive(childSkill.id);
    }

    // Delete the current skill
    await this.db.skill.delete({
      where: { id: skillId },
    });
  }

  public async isSkillUsed(skillId: string): Promise<boolean> {
    // Check if the skill is used in learning units
    const learningUnits = await this.db.learningUnit.findMany({
      where: {
        OR: [{ requirements: { some: { id: skillId } } }, { teachingGoals: { some: { id: skillId } } }],
      },
    });
    return learningUnits.length > 0;
  }

  public async getChildSkills(parentSkillId: string): Promise<Skill[]> {
    // Query to retrieve children of the skill
    return await this.db.skill.findMany({
      where: { parentSkills: { some: { id: parentSkillId } } },
    });
  }

  public async deleteSkillRecursive(skillId: string): Promise<void> {
    const childSkills = await this.getChildSkills(skillId);

    for (const childSkill of childSkills) {
      await this.deleteSkillRecursive(childSkill.id);
    }

    await this.db.skill.delete({
      where: { id: skillId },
    });
  }

  async checkNestedSkillsExist(nestedSkillIds: (string | undefined)[]): Promise<boolean> {
    const validSkillIds = nestedSkillIds.filter((id) => typeof id === 'string');

    const skillMap = new Map<string, boolean>(); // To track visited skills
    const skillsToCheck = [...validSkillIds]; // Copy of validSkillIds for processing

    while (skillsToCheck.length > 0) {
      const skillId = skillsToCheck.pop();

      // Check if the skill has already been visited, indicating a cyclic relationship
      if (skillId && skillMap.has(skillId)) {
        return false; // Cyclic relationship detected
      }

      // Mark the skill as visited
      if (skillId) {
        skillMap.set(skillId, true);
      }

      // Query the database to check if the skill exists
      if (skillId) {
        const skill = await this.db.skill.findUnique({
          where: { id: skillId },
          include: { nestedSkills: true },
        });

        // If the skill doesn't exist, return false
        if (!skill) {
          return false;
        }

        // Add the nested skills of the current skill to the list for further checking
        skillsToCheck.push(...skill.nestedSkills.map((nestedSkill) => nestedSkill.id));
      }
    }

    return true;
  }

  async adaptSkill(dto: SkillDto): Promise<void> {
    // Check if the skill is already in use
    const isUsed = await this.isSkillUsed(dto.id);
    if (isUsed) {
      throw new BadRequestException('Skill is already used and cannot be modified.');
    }

    // Validate the nestedSkills to ensure they exist and won't create a cycle
    const nestedSkillsExist = await this.checkNestedSkillsExist(dto.nestedSkills);
    if (!nestedSkillsExist) {
      throw new BadRequestException(
        'One or more specified nested skills do not exist or would create a cyclic relationship.',
      );
    }

    // Update the skill with the provided data, including nestedSkills
    const updatedSkill = await this.db.skill.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
        level: dto.level,
        description: dto.description,
        nestedSkills: {
          connect: dto.nestedSkills.map((nestedSkillId) => ({ id: nestedSkillId })),
        },
      },
    });
  }
}
