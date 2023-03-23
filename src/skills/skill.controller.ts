import { Body, Controller, Get, Param, ParseBoolPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  SkillCreationDto, SkillDto, SkillRepositorySearchDto,SkillRepositoryCreationDto, SkillListDto, SkillRepositoryDto, SkillRepositoryListDto, SkillRepositorySelectionDto 
} from './dto';

import { SkillMgmtService } from './skill.service';

@ApiTags('Skill')
@Controller('skill-repositories')
export class SkillMgmtController {
  constructor(private repositoryService: SkillMgmtService) {}

  @Post()
  searchForRepositories(@Body() dto?: SkillRepositorySearchDto) {
    return this.repositoryService.findSkillRepositories(dto);
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
    return this.repositoryService.listRepositories(userId);
  }

  /**
   * Returns one repository and its unresolved elements.
   * Competences and their relations are handled as IDs and need to be resolved on the client-side.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':repositoryId')
  async loadRepository(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string) {
    return this.repositoryService.loadSkillRepository(userId, repositoryId);
  }

  /**
   * Returns one resolved repository and its elements.
   * Competencies and their relations are resolved at the server.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('resolve/:repositoryId')
  async loadResolvedRepository(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string) {
    return this.repositoryService.loadResolvedSkillRepository(userId, repositoryId);
  }

  /**
   * Creates a new competence repository for the specified user.
   * @param userId The user for which the new repository shall be created.
   * @param dto specifies the attributes of the new repository
   * @returns The newly created repository or an error message.
   */
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('create')
  createRepository(@GetUser('id') userId: string, @Body() dto: SkillRepositoryCreationDto) {
    return this.repositoryService.createRepository(userId, dto);
  }

  /**
   * Creates a new competence at the specified repository and returns the created competence.
   * @param userId The owner of the repository
   * @param repositoryId The repository at which the competence shall be added to.
   * @param dto The competence description
   * @returns The created competence.
   
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':repositoryId/competencies/add_competence')
  addCompetence(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: CompetenceCreationDto,
  ) {
    return this.repositoryService.createCompetence(userId, repositoryId, dto);
  }
*/
  /**
   * Returns the specified Competence.
   * @param competenceId The ID of the Competence, that shall be returned
   * @returns The specified Competence.
   
  @Get('competencies/:competenceId')
  getCompetence(@Param('competenceId') competenceId: string) {
    return this.repositoryService.getCompetence(competenceId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':repositoryId/competencies/add_uebercompetence')
  addUeberCompetence(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: UeberCompetenceCreationDto,
  ) {
    return this.repositoryService.createUeberCompetence(userId, repositoryId, dto);
  }
*/
  /**
   * Returns the specified Uber-Competence.
   * @param uebercompetenceId The ID of the Uber-Competence, that shall be returned
   * @returns The specified Uber-Competence.
 
  @Get('uber_competencies/:uebercompetenceId')
  getUberCompetence(@Param('uebercompetenceId') uebercompetenceId: string) {
    return this.repositoryService.getUberCompetence(uebercompetenceId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':repositoryId/competencies/modify_uebercompetence')
  modify(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: UeberCompetenceModificationDto,
  ) {
    return this.repositoryService.modifyUeberCompetence(userId, repositoryId, dto);
  }

  @Post(':repositoryId/resolveUberCompetencies')
  resolveToCompetencies(@Param('repositoryId') repositoryId: string, @Body() dto: UberCompetenceResolveRequestDto) {
    return this.repositoryService.resolveUberCompetencies(repositoryId, dto);
  }
    */
}
