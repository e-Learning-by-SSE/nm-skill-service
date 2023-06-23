import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PathFinderService } from './pathFinder.service';

@ApiTags('PathFinder')
@Controller('PathFinder')
export class PathFinderController {
  constructor(private pfService: PathFinderService) {}

  @Get('getConnectedGraphForSkill/:skillId')
  getConnectedGraphForSkill(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedGraphForSkill(skillId);
  }

  @Get('getConnectedSkillGraphForSkill/:skillId')
  getConnectedSkillGraphForSkill(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedSkillGraphForSkill(skillId);
  }

  @Get('getConnectedGraphForSkillwithResolvedElements/:skillId')
  getConnectedGraphForSkillwithResolvedElements(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedGraphForSkillwithResolvedElements(skillId);
  }

  @Get('checkGraph/:skillId')
  checkGraph(@Param('skillId') skillId: string) {
    return this.pfService.isGraphForIdACycle(skillId);
  }
  @Get('getPathforJava')
  getPathToSkill() {
    return this.pfService.pathForSkill();
  }
}
