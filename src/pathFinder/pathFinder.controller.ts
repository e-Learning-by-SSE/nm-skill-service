import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PathFinderService } from './pathFinder.service';
import { PathRequestDto } from './dto';

@ApiTags('PathFinder')
@Controller('PathFinder')
export class PathFinderController {
  constructor(private pfService: PathFinderService) {}

  @Get('getConnectedGraphForSkill/:skillId')
  getConnectedGraphForSkill(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedGraphForSkill(skillId, true);
  }

  @Get('getConnectedSkillGraphForSkill/:skillId')
  getConnectedSkillGraphForSkill(@Param('skillId') skillId: string) {
    return this.pfService.getConnectedGraphForSkill(skillId, false);
  }

  // @Get('getConnectedGraphForSkillwithResolvedElements/:skillId')
  // getConnectedGraphForSkillwithResolvedElements(@Param('skillId') skillId: string) {
  //   return this.pfService.getConnectedGraphForSkillwithResolvedElements(skillId);
  // }

  @Get('checkGraph/:skillId')
  checkGraph(@Param('skillId') skillId: string) {
    return this.pfService.isGraphForIdACycle(skillId);
  }
  @Get('getPathforJava')
  getPathToSkill() {
    return this.pfService.pathForSkill('1');
  }

  @Post('computePath/')
  computePath(@Body() dto: PathRequestDto) {
    return this.pfService.computePath(dto);
  }

  // TODO: wird alles unterrichtet
  @Get('allSkillsDone/:repoId')
  allSkillsDone(@Param('repoId') repoId: string) {
    return this.pfService.allSkillsDone(repoId);
  }
}
