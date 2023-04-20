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

/**
 * This factory is responsible for database-based operations on Learning Units. It is used to:
 * - Convert Self-Learning/Search specific DTOs into database operations (CRUD operations)
 * - Convert DAOs received from the data based to project-specific DTOs (including error handling)
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
@Injectable()
export class LearningUnitFactory {
  readonly SEARCH: boolean;
  readonly SELF_LEARN: boolean;

  constructor(private db: PrismaService, private config: ConfigService) {
    this.SEARCH = this.config.get('EXTENSION_SEARCH') === 'true';
    this.SELF_LEARN = this.config.get('EXTENSION_SELF_LEARN') === 'true';
  }

  public async loadLearningUnit(learningUnitId: string): Promise<LearningUnit> {
    const learningUnit = await this.db.learningUnit.findUnique({
      where: { id: Number(learningUnitId) },
      include: {
        searchInfos: this.SEARCH,
        selfLearnInfos: this.SELF_LEARN,
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

  private async loadAllSearchLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.db.learningUnit.findMany({
      ...args,
      include: {
        searchInfos: true,
      },
      where: {
        searchInfos: {
          isNot: null,
        },
      },
    });

    if (!learningUnits) {
      throw new NotFoundException(`Can not find any LearningUnits with parameters: ${args}`);
    }

    const learningUnitList = new SearchLearningUnitListDto();
    learningUnitList.learningUnits = learningUnits
      .filter(isSearchLUDaoType)
      .map((lu) => SearchLearningUnitDto.createFromDao(lu));

    return learningUnitList;
  }

  private async loadAllSelfLearnLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.db.learningUnit.findMany({
      ...args,
      include: {
        selfLearnInfos: true,
      },
      where: {
        selfLearnInfos: {
          isNot: null,
        },
      },
    });

    if (!learningUnits) {
      throw new NotFoundException(`Can not find any LearningUnits with parameters: ${args}`);
    }

    const learningUnitList = new SelfLearnLearningUnitListDto();
    learningUnitList.learningUnits = learningUnits
      .filter(isSelfLearnLUDaoType)
      .map((lu) => SelfLearnLearningUnitDto.createFromDao(lu));

    return learningUnitList;
  }

  public async loadAllLearningUnits() {
    if (this.SEARCH) {
      return this.loadAllSearchLearningUnits();
    } else if (this.SELF_LEARN) {
      return this.loadAllSelfLearnLearningUnits();
    } else {
      throw new Error('No extension enabled');
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
              linkToHelpMaterial: dto.linkToHelpMaterial ?? '',
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
