import { identity } from 'rxjs';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computePageQuery, computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
   SkillCreationDto, SkillDto,SkillRepositoryCreationDto, SkillRepositorySearchDto, SkillListDto, SkillRepositoryDto, SkillRepositoryListDto, SkillRepositorySelectionDto , ResolvedSkillRepositoryDto
} from './dto';
import { UnresolvedSkillRepositoryDto } from './dto/unresolved-skill-repository.dto';


/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 */
@Injectable()
export class SkillMgmtService {
  constructor(private db: PrismaService) {}

  async findSkillRepositories(dto?: SkillRepositorySearchDto) {
    const query: Prisma.SkillRepositoryFindManyArgs = computePageQuery(dto);
    const repositories = await this.db.skillRepository.findMany(query);

    const repoList = new SkillRepositoryListDto();
    repoList.repositories = repositories.map((repository) => SkillRepositoryDto.createFromDao(repository));

    return repoList;
  }

  /**
   * Returns a list of all repositories owned by the specified user.
   * Won't include any information about nested skills.
   * @param userId The owner of the repositories
   * @returns The list of his repositories
   */
  async listRepositories(userId: string) {
    const repositories = await this.db.skillRepository.findMany({
      where: {
        userId: userId,
      },
    });

    const repoList = new SkillRepositoryListDto();
    repoList.repositories = repositories.map((repository) => SkillRepositoryDto.createFromDao(repository));

    return repoList;
  }

  async createRepository(userId: string, dto: SkillRepositoryCreationDto) {
    try {
      const repository = await this.db.skillRepository.create({
        data: {
          userId: userId,
          name: dto.name,
        
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

  public async getSkillRepository(userId: string, repositoryId: string, includeSkills = false) {
    // Retrieve the repository, at which the skill shall be stored to
    const repository = await this.db.skillRepository.findUnique({
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

    if (repository.userId != userId) {
      throw new ForbiddenException('Repository owned by another user');
    }

    return repository;
  }
  

  public async loadSkillRepository(userId: string, repositoryId: string) {
    const repository = await this.getSkillRepository(userId, repositoryId, true);
    const result: UnresolvedSkillRepositoryDto = {...SkillRepositoryDto.createFromDao(repository), 
    skills:repository.skills.map((c)=>c.id)  
    };

    return result;
  }

  public async loadResolvedSkillRepository(userId: string, repositoryId: string) {
    const repository = await this.getSkillRepository(userId, repositoryId, true);
    const result = ResolvedSkillRepositoryDto.create(
      repository.id,
      repository.name,
      repository.version,
      
      repository.description,
    );

    // Load all skills of repository
    const skillMap = new Map<string, SkillDto>();
    repository.skills.forEach((c) => {
      // Convert DAO -> DTO
      const skill = SkillDto.createFromDao(c);

      skillMap.set(c.id, skill);
      result.skills.push(skill);
    });

   
   
    return result;
  }


  /**
   * Adds a new skill to a specified repository
   * @param userId The ID of the user who wants to create a skill at one of his repositories
   * @param dto Specifies the skill to be created and the repository at which it shall be created
   * @returns The newly created skill
   */
  
  async createSkill(userId: string, skillRepositoryId: string, dto: SkillCreationDto) {
    // Checks that the user is the owner of the repository / repository exists
    await this.getSkillRepository(userId, skillRepositoryId);

    // Create and return skill
    try {
      const skill = await this.db.skill.create({
        data: {
          repositoryId: skillRepositoryId,
          name: dto.name,
          bloomLevel: dto.bloomLevel,
          description: dto.description,
        },
      });

      return skill as SkillDto;
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

  

  private async loadSkill(skillId: string, skillRepositoryId: string | null) {
    const skill = await this.db.skill.findUnique({ where: { id: skillId } });

    if (!skill) {
      throw new NotFoundException('Specified skill not found: ' + skillId);
    }

    if (skillRepositoryId) {
      if (skill.repositoryId != skillRepositoryId) {
        throw new ForbiddenException('Skill belongs to another repository.');
      }
    }

    return skill;
  }

  public async getSkill(skillId: string) {
    const dao = await this.loadSkill(skillId, null);

    if (!dao) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }

    return SkillDto.createFromDao(dao);
  }

  public async loadAllSkills() {
    const skills = await this.db.skill.findMany();

    if (!skills) {
      throw new NotFoundException('Can not find any skills');
    }

    const skillList = new SkillListDto();
    skillList.skills = skills.map((skill) => SkillDto.createFromDao(skill));

    return skills;
  }
}
