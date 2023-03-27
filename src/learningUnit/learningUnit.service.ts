import { identity } from 'rxjs';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computePageQuery, computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import { LearningUnitCreationDto, LearningUnitDto, LearningUnitListDto } from './dto';

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 */
@Injectable()
export class LearningUnitMgmtService {
  constructor(private db: PrismaService) {}

  /**
   * Adds a new learningUnit
   * @param userId The ID of the user who wants to create a learningUnit.
   * @param dto Specifies the learningUnit to be created and the repository at which it shall be created
   * @returns The newly created learningUnit

   */
  async createLearningUnit(dto: LearningUnitCreationDto) {
    // Create and return learningUnit
    try {
      const learningUnit = await this.db.learningUnit.create({
        data: {
          language: dto.language,
          title: dto.title,
          description: dto.description ?? '',
          processingTime: dto.processingTime,
          rating: dto.rating,
          contentCreator: dto.contentCreator,
          targetAudience: dto.targetAudience,
          semanticDensity: dto.semanticDensity,
          semanticGravity: dto.semanticGravity,
          contentTags: dto.contentTags,
          contextTags: dto.contextTags,
          linkToHelpMaterial: dto.linkToHelpMaterial??'',
        },
      });

      return learningUnit as LearningUnitDto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('LearningUnit already exists in specified repository');
        }
      }
      throw error;
    }
  }

  private async loadLearningUnit(learningUnitId: string) {
    const learningUnit = await this.db.learningUnit.findUnique({ where: { id: Number(learningUnitId) } });

    if (!learningUnit) {
      throw new NotFoundException('Specified learningUnit not found: ' + learningUnitId);
    }

    return learningUnit;
  }

  public async getLearningUnit(learningUnitId: string) {
    const dao = await this.loadLearningUnit(learningUnitId);

    if (!dao) {
      throw new NotFoundException(`Specified learningUnit not found: ${learningUnitId}`);
    }

    return LearningUnitDto.createFromDao(dao);
  }

  public async loadAllLearningUnits() {
    const learningUnits = await this.db.learningUnit.findMany();

    if (!learningUnits) {
      throw new NotFoundException('Can not find any learningUnits');
    }

    const learningUnitList = new LearningUnitListDto();
    learningUnitList.learningUnits = learningUnits.map((learningUnit) => LearningUnitDto.createFromDao(learningUnit));

    return learningUnits;
  }
}
