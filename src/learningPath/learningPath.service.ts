import { identity } from 'rxjs';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computePageQuery, computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
   LearningPathCreationDto, LearningPathDto, LearningPathListDto
} from './dto';



/**
 * Service that manages the creation/update/deletion 
 * @author Wenzel
 */
@Injectable()
export class LearningPathMgmtService {
  constructor(private db: PrismaService) {}

  
  /**
   * Adds a new learningPath
   * @param userId The ID of the user who wants to create a learningPath 
   * @param dto Specifies the learningPath to be created 
   * @returns The newly created learningPath

   */
  async createLearningPath(  dto: LearningPathCreationDto) {
 
    // Create and return learningPath
    try {
      const learningPath = await this.db.learningPath.create({
        data: {
        
          title: dto.titel ,
          tagetAudience: dto.tagetAudience,
          description: dto.description
        },
      });

      return learningPath as unknown as LearningPathDto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('LearningPath already exists');
        }
      }
      throw error;
    }
  }
  
  

  private async loadLearningPath(learningPathId: string) {
    const learningPath = await this.db.learningPath.findUnique({ where: { id: learningPathId } });

    if (!learningPath) {
      throw new NotFoundException('Specified learningPath not found: ' + learningPathId);
    }



    return learningPath;
  }

  public async getLearningPath(learningPathId: string) {
    const dao = await this.loadLearningPath(learningPathId);

    if (!dao) {
      throw new NotFoundException(`Specified learningPath not found: ${learningPathId}`);
    }

    return LearningPathDto.createFromDao(dao);
  }

  public async loadAllLearningPaths() {
    const learningPaths = await this.db.learningPath.findMany();

    if (!learningPaths) {
      throw new NotFoundException('Can not find any learningPaths');
    }

    const learningPathList = new LearningPathListDto();
    learningPathList.learningPaths = learningPaths.map((learningPath) => LearningPathDto.createFromDao(learningPath));

    return learningPaths;
  }
}
