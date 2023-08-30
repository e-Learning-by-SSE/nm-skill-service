import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchLearningUnitCreationDto, SearchLearningUnitDto, SearchLearningUnitListDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { LearningUnit, Prisma, Skill } from '@prisma/client';

/**
 * This factory is responsible for database-based operations on Learning Units. It is used to:
 * - Convert Self-Learning/Search specific DTOs into database operations (CRUD operations)
 * - Convert DAOs received from the data based to project-specific DTOs (including error handling)
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
@Injectable()
export class LearningUnitFactory {
  constructor(private db: PrismaService) {}

  public async loadLearningUnit(learningUnitId: string): Promise<LearningUnit> {
    const learningUnit = await this.db.learningUnit.findUnique({
      where: { id: learningUnitId },
      include: {
        teachingGoals: true,
        requirements: true,
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
      },
    });

    if (!learningUnits) {
      throw new NotFoundException(`Can not find any LearningUnits with parameters: ${args}`);
    }

    return learningUnits;
  }

  private createLearningUnitDto(
    dao: LearningUnit & {
      teachingGoals?: Skill[];
      requirements?: Skill[];
    },
  ) {
    const searchUnit = SearchLearningUnitDto.createFromDao(dao);
    searchUnit.requiredSkills = dao.requirements?.map((skill) => skill.id) ?? [];
    searchUnit.teachingGoals = dao.teachingGoals?.map((skill) => skill.id) ?? [];

    return searchUnit;
  }

  public async loadAllLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
    const learningUnits = await this.loadManyLearningUnits(args);
    const searchUnits = new SearchLearningUnitListDto();
    searchUnits.learningUnits = learningUnits.map(this.createLearningUnitDto);

    return searchUnits;
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

          processingTime: dto.processingTime,
          rating: dto.rating,
          contentCreator: dto.contentCreator,
          targetAudience: dto.targetAudience,
          semanticDensity: dto.semanticDensity,
          semanticGravity: dto.semanticGravity,
          contentTags: dto.contentTags,
          contextTags: dto.contextTags,
          linkToHelpMaterial: dto.linkToHelpMaterial,

          requirements: {
            connect: dto.requiredSkills?.map((skillId) => ({ id: skillId })) ?? [],
          },

          teachingGoals: {
            connect: dto.teachingGoals?.map((skillId) => ({ id: skillId })) ?? [],
          },
        },
        include: {
          requirements: true,

          teachingGoals: true,
        },
      });

      return this.createLearningUnitDto(learningUnit);
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

  public async createLearningUnit(dto: SearchLearningUnitCreationDto) {
    return this.createSearchLearningUnit(dto);
  }
}
