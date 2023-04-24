import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { SkillCreationDto, SkillRepositorySearchDto, SkillRepositoryCreationDto } from './dto';

import { SkillMgmtService } from './skill.service';

@ApiTags('Skill')
@Controller('skill-repositories')
export class SkillMgmtController {
  constructor(private skillService: SkillMgmtService) {}

  @Post()
  searchForRepositories(@Body() dto?: SkillRepositorySearchDto) {
    return this.skillService.findSkillRepositories(dto);
  }

  /**
   * Lists all repositories of the specified user, without showing its content.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('showOwn')
  listRepositories(@GetUser('id') userId: string) {
    return this.skillService.listRepositories(userId);
  }

  /**
   * Lists all skills.
   
   * @returns List of all skills.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('showAllSkills')
  listSkills() {
    return this.skillService.loadAllSkills();
  }

  /**
   * Returns one repository and its unresolved elements.
   * Skills and their relations are handled as IDs and need to be resolved on the client-side.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':repositoryId')
  async loadRepository(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string) {
    return this.skillService.loadSkillRepository(userId, repositoryId);
  }

  /**
   * Returns one resolved repository and its elements.
   * Skills and their relations are resolved at the server.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('resolve/:repositoryId')
  async loadResolvedRepository(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string) {
    return this.skillService.loadResolvedSkillRepository(userId, repositoryId);
  }

  /**
   * Creates a new skill repository for the specified user.
   * @param userId The user for which the new repository shall be created.
   * @param dto specifies the attributes of the new repository
   * @returns The newly created repository or an error message.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('skill/create')
  createRepository(@GetUser('id') userId: string, @Body() dto: SkillRepositoryCreationDto) {
    return this.skillService.createRepository(userId, dto);
  }

  /**
   * Creates a new skill at the specified repository and returns the created skill.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the skill shall be added to.
   * @param dto The skill description
   * @returns The created skill.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':repositoryId/skill/add_skill')
  addSkill(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string, @Body() dto: SkillCreationDto) {
    return this.skillService.createSkill(userId, repositoryId, dto);
  }

  /**
   * Returns the specified skill.
   * @param skillId The ID of the skill, that shall be returned
   * @returns The specified skill.
   */
  @Get('skill/:skillId')
  getSkill(@Param('skillId') skillId: string) {
    return this.skillService.getSkill(skillId);
  }
}
