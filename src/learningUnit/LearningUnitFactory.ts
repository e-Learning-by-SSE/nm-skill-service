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
import { LearningUnit, Prisma } from '@prisma/client';
import { isSearchLUDaoType, isSelfLearnLUDaoType } from './types';
import { MODE } from '../env.validation';

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
      where: { id: Number(learningUnitId) },
      include: {
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

    // Using Type Guard to identify the correct type: https://www.typescriptlang.org/docs/handbook/advanced-types.html
    if (isSearchLUDaoType(dao)) {
      return SearchLearningUnitDto.createFromDao(dao);
    } else if (isSelfLearnLUDaoType(dao)) {
      return SelfLearnLearningUnitDto.createFromDao(dao);
    } else {
      throw new Error(`No project-specific extra information provided as expected: ${learningUnitId}`);
    }
  }

  private async loadManyLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.db.learningUnit.findMany({
      ...args,
      include: {
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

  public async loadAllLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.loadManyLearningUnits(args);

    switch (this.extension) {
      case MODE.SEARCH:
        const searchUnits = new SearchLearningUnitListDto();
        searchUnits.learningUnits = learningUnits
          .filter(isSearchLUDaoType)
          .map((lu) => SearchLearningUnitDto.createFromDao(lu));

        return searchUnits;
      case MODE.SELFLEARN:
        const selflearnUnits = new SelfLearnLearningUnitListDto();
        selflearnUnits.learningUnits = learningUnits
          .filter(isSelfLearnLUDaoType)
          .map((lu) => SelfLearnLearningUnitDto.createFromDao(lu));

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
    console.log('createSearchLearningUnit', dto);
    // Create and return learningUnit
    try {
      const learningUnit = await this.db.learningUnit.create({
        data: {
          title: dto.title,
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
        },
        include: {
          searchInfos: true,
        },
      });

      if (isSearchLUDaoType(learningUnit)) {
        return SearchLearningUnitDto.createFromDao(learningUnit);
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
          description: dto.description ?? '',
          language: dto.language,

          selfLearnInfos: {
            create: {
              order: dto.order,
            },
          },
        },
        include: {
          selfLearnInfos: true,
        },
      });

      if (isSelfLearnLUDaoType(learningUnit)) {
        return SelfLearnLearningUnitDto.createFromDao(learningUnit);
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
