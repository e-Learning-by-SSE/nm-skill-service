import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NuggetCreationDto } from './dto';

import { NuggetMgmtService } from './nugget.service';

@ApiTags('Nugget')
@Controller('nuggets')
export class NuggetMgmtController {
  constructor(private nuggetService: NuggetMgmtService) {}

  /**
   * Lists all nuggets.
   
   * @returns List of all nuggets.
   */
  @Get('showAllNuggets')
  listNuggets() {
    return this.nuggetService.loadAllNuggets();
  }

  /**
   * Creates a new nugget at the specified repository and returns the created nugget.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the nugget shall be added to.
   * @param dto The nugget description
   * @returns The created nugget.
   */
  @Post('add_nugget')
  addNugget(@Body() dto: NuggetCreationDto) {
    return this.nuggetService.createNugget(dto);
  }

  /**
   * Returns the specified nugget.
   * @param nuggetId The ID of the nugget, that shall be returned
   * @returns The specified nugget.
   */
  @Get(':nuggetId')
  getNugget(@Param('nuggetId') nuggetId: string) {
    return this.nuggetService.getNugget(nuggetId);
  }
}
