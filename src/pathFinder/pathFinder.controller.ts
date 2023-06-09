import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';



import { PathFinderService } from './pathFinder.service';

@ApiTags('PathFinder')
@Controller('PathFinder')
export class PathFinderController {
  constructor(private pfService: PathFinderService) {}

  /**
   * Lists all nuggets.
   
   * @returns List of all nuggets.
   */
  @Get('getConnectedGraphForSkill/:skillId')
  getConnectedGraphForSkill(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedGraphForSkill(skillId);
  }

  @Get('checkGraph/:skillId')
  checkGraph(@Param('skillId') skillId: string) {
    return this.pfService.isGraphForIdACycle(skillId);
  }
  @Get('getPathToSkill/:skillId')
  getPathToSkill(@Param('skillId') skillId: string) {
    return this.pfService.pathForSkill(skillId);
  }

 


}