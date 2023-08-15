import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  SearchLearningUnitCreationDto,
  SelfLearnLearningUnitDto,
  SearchLearningUnitDto,
  SelfLearnLearningUnitCreationDto,
  SearchLearningUnitListDto,
  SelfLearnLearningUnitListDto,
} from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { LearningUnit, Prisma, Skill } from '@prisma/client';
import { SearchLUDaoType, SelfLearnLUDaoType, isSearchLUDaoType, isSelfLearnLUDaoType } from './types';
import { MODE } from '../config/env.validation';

/**
 * This factory is responsible for database-based operations on Learning Units. It is used to:
 * - Convert Self-Learning/Search specific DTOs into database operations (CRUD operations)
 * - Convert DAOs received from the data based to project-specific DTOs (including error handling)
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
@Injectable()
export class LearningUnitFactory {
  private readonly extension: MODE;
  // keyof Prisma.LearningUnitInclude ensures that we can only select valid tables (for which an relation exists)
  private readonly extensionTable: keyof Prisma.LearningUnitInclude;

  constructor(private db: PrismaService, private config: ConfigService) {
    const tmpValue = this.config.get('EXTENSION');
    if (tmpValue) {
      this.extension = tmpValue;
      switch (this.extension) {
        case MODE.SEARCH:
          this.extensionTable = 'searchInfos';
          break;
        case MODE.SELFLEARN:
          this.extensionTable = 'selfLearnInfos';
          break;
        default:
          throw new Error(`Unknown extension mode: ${this.extension}`);
      }
    } else {
      throw new Error('No Extension activated!');
    }
  }

  public async loadLearningUnit(learningUnitId: string): Promise<LearningUnit> {
    const learningUnit = await this.db.learningUnit.findUnique({
      where: { id: learningUnitId },
      include: {
        teachingGoals: true,
        requirements: true,

        [this.extensionTable]: true,
      },
    });

    if (!learningUnit) {
      throw new NotFoundException(`Specified LearningUnit not found: ${learningUnitId}`);
    }

    return learningUnit;
  }

  public async getLearningUnit(learningUnitId: string) {
    const dao = await this.loadLearningUnit(learningUnitId);

    return this.createLearningUnitDto(dao);
  }

  private async loadManyLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.db.learningUnit.findMany({
      ...args,
      include: {
        teachingGoals: true,
        requirements: true,

        [this.extensionTable]: true,
      },
      // where: {
      //   [this.extensionTable]: true,
      // },
    });

    if (!learningUnits) {
      throw new NotFoundException(`Can not find any LearningUnits with parameters: ${args}`);
    }

    return learningUnits;
  }

  private createSearchLearningUnitDto(
    learningUnit: SearchLUDaoType & {
      teachingGoals?: Skill[];
      requirements?: Skill[];
    },
  ) {
    const searchUnit = SearchLearningUnitDto.createFromDao(learningUnit);
    searchUnit.requiredSkills = learningUnit.requirements?.map((skill) => skill.id) ?? [];
    searchUnit.teachingGoals = learningUnit.teachingGoals?.map((skill) => skill.id) ?? [];

    return searchUnit;
  }

  private createSelfLearnUnitDto(
    learningUnit: SelfLearnLUDaoType & {
      teachingGoals?: Skill[];
      requirements?: Skill[];
    },
  ) {
    const selfLearnUnit = SelfLearnLearningUnitDto.createFromDao(learningUnit);

    selfLearnUnit.requiredSkills = learningUnit.requirements?.map((skill) => skill.id) ?? [];
    selfLearnUnit.teachingGoals = learningUnit.teachingGoals?.map((skill) => skill.id) ?? [];

    return selfLearnUnit;
  }

  private createLearningUnitDto(dao: LearningUnit) {
    // Using Type Guard to identify the correct type: https://www.typescriptlang.org/docs/handbook/advanced-types.html
    if (isSearchLUDaoType(dao)) {
      return this.createSearchLearningUnitDto(dao);
    } else if (isSelfLearnLUDaoType(dao)) {
      return this.createSelfLearnUnitDto(dao);
    } else {
      throw new Error(`No project-specific extra information provided as expected: ${dao.id}`);
    }
  }

  public async loadAllLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.loadManyLearningUnits(args);

    switch (this.extension) {
      case MODE.SEARCH:
        const searchUnits = new SearchLearningUnitListDto();
        searchUnits.learningUnits = learningUnits.filter(isSearchLUDaoType).map(this.createSearchLearningUnitDto);

        return searchUnits;
      case MODE.SELFLEARN:
        const selflearnUnits = new SelfLearnLearningUnitListDto();
        selflearnUnits.learningUnits = learningUnits.filter(isSelfLearnLUDaoType).map(this.createSelfLearnUnitDto);

        return selflearnUnits;
      default:
        throw new Error(`Unknown extension mode: ${this.extension}`);
    }
  }

  /**
   * Create a new Search-LearningUnit.
   * @param dto Specifies the learningUnit to be created
   * @returns The newly created learningUnit

   */
  private async createSearchLearningUnit(dto: SearchLearningUnitCreationDto) {
    // Create and return learningUnit
    try {
      const learningUnit = await this.db.learningUnit.create({
        data: {
          title: dto.title,
          resource: dto.resource,
          description: dto.description ?? '',
          language: dto.language,

          searchInfos: {
            create: {
              processingTime: dto.processingTime,
              rating: dto.rating,
              contentCreator: dto.contentCreator,
              targetAudience: dto.targetAudience,
              semanticDensity: dto.semanticDensity,
              semanticGravity: dto.semanticGravity,
              contentTags: dto.contentTags,
              contextTags: dto.contextTags,
              linkToHelpMaterial: dto.linkToHelpMaterial,
            },
          },

          requirements: {
            connect: dto.requiredSkills?.map((skillId) => ({ id: skillId })) ?? [],
          },

          teachingGoals: {
            connect: dto.teachingGoals?.map((skillId) => ({ id: skillId })) ?? [],
          },
        },
        include: {
          searchInfos: true,

          teachingGoals: true,
        },
      });

      if (isSearchLUDaoType(learningUnit)) {
        return this.createSearchLearningUnitDto(learningUnit);
      } else {
        throw new Error(`SearchInfos not found: ${learningUnit.id}`);
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Learning Unit already exists');
        }
      }
      throw error;
    }
  }

  /**
   * Create a new SelfLearn-LearningUnit.
   * @param dto Specifies the learningUnit to be created
   * @returns The newly created learningUnit

   */
  private async createSelfLearnLearningUnit(dto: SelfLearnLearningUnitCreationDto) {
    // Create and return learningUnit
    try {
      const learningUnit = await this.db.learningUnit.create({
        data: {
          title: dto.title,
          resource: dto.resource,
          description: dto.description ?? '',
          language: dto.language,

          selfLearnInfos: {
            create: {
              order: dto.order,
            },
          },

          teachingGoals: {
            connect: dto.teachingGoals?.map((skillId) => ({ id: skillId })) ?? [],
          },
        },
        include: {
          selfLearnInfos: true,

          teachingGoals: true,
        },
      });

      if (isSelfLearnLUDaoType(learningUnit)) {
        return this.createSelfLearnUnitDto(learningUnit);
      } else {
        throw new Error(`Self-Learn Infos not found: ${learningUnit.id}`);
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Learning Unit already exists');
        }
      }
      throw error;
    }
  }

  public async createLearningUnit(dto: SearchLearningUnitCreationDto | SelfLearnLearningUnitCreationDto) {
    if (dto instanceof SearchLearningUnitCreationDto) {
      return this.createSearchLearningUnit(dto);
    } else {
      return this.createSelfLearnLearningUnit(dto);
    }
  }
}
