import { identity } from 'rxjs';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NuggetCategory, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { computePageQuery, computeRelationUpdate } from '../db_utils';
import { PrismaService } from '../prisma/prisma.service';
import {
   NuggetCreationDto, NuggetDto, NuggetListDto
} from './dto';



/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 */
@Injectable()
export class NuggetMgmtService {
  constructor(private db: PrismaService) {}

  
  /**
   * Adds a new nugget
   * @param userId The ID of the user who wants to create a nugget at one of his repositories
   * @param dto Specifies the nugget to be created and the repository at which it shall be created
   * @returns The newly created nugget

  
  async createNugget(userId: string,  dto: NuggetCreationDto) {
    // Checks that the user is the owner of the repository / repository exists
  
    // Create and return nugget
    try {
      const nugget = await this.db.nugget.create({
        data: {
        
          language: dto.language,
          processingTime: dto.processingTime.toString(),
          isTypeof: NuggetCategory.EXAMPLE,
          presenter: dto.presenter, 
          mediatype: dto.mediatype
        },
      });

      return nugget as NuggetDto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Nugget already exists in specified repository');
        }
      }
      throw error;
    }
  }
   */
  

  private async loadNugget(nuggetId: number, nuggetRepositoryId: string | null) {
    const nugget = await this.db.nugget.findUnique({ where: { id: nuggetId } });

    if (!nugget) {
      throw new NotFoundException('Specified nugget not found: ' + nuggetId);
    }



    return nugget;
  }

  public async getNugget(nuggetId: number) {
    const dao = await this.loadNugget(nuggetId, null);

    if (!dao) {
      throw new NotFoundException(`Specified nugget not found: ${nuggetId}`);
    }

    return NuggetDto.createFromDao(dao);
  }

  public async loadAllNuggets() {
    const nuggets = await this.db.nugget.findMany();

    if (!nuggets) {
      throw new NotFoundException('Can not find any nuggets');
    }

    const nuggetList = new NuggetListDto();
    nuggetList.nuggets = nuggets.map((nugget) => NuggetDto.createFromDao(nugget));

    return nuggets;
  }
}
