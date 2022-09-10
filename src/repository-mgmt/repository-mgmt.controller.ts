import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CompetenceCreationDto, RepositoryCreationDto, UeberCompetenceCreationDto } from './dto';
import { UeberCompetenceModificationDto } from './dto/ueber-competence-modification.dto';
import { RepositoryMgmtService } from './repository-mgmt.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('repositories')
@Controller('repositories')
export class RepositoryMgmtController {
  constructor(private repositoryService: RepositoryMgmtService) {}

  /**
   * Lists all repositories of the specified user, without showing its content.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @Get()
  listRepositories(@GetUser('id') userId: string) {
    return this.repositoryService.listRepositories(userId);
  }

  /**
   * Returns one repository and its elements.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @Get(':repositoryId')
  async showRepository(@GetUser('id') userId: string, @Param('repositoryId') repositoryId: string) {
    return this.repositoryService.getRepository(userId, repositoryId, true);
  }

  /**
   * Creates a new competence repository for the specified user.
   * @param userId The user for which the new repository shall be created.
   * @param dto specifies the attributes of the new repository
   * @returns The newly created repository or an error message.
   */
  @Post('create')
  createRepository(@GetUser('id') userId: string, @Body() dto: RepositoryCreationDto) {
    return this.repositoryService.createRepository(userId, dto);
  }

  @Post(':repositoryId/competencies/add_competence')
  addCompetence(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: CompetenceCreationDto,
  ) {
    return this.repositoryService.createCompetence(userId, repositoryId, dto);
  }

  @Post(':repositoryId/competencies/add_uebercompetence')
  addUeberCompetence(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: UeberCompetenceCreationDto,
  ) {
    return this.repositoryService.createUeberCompetence(userId, repositoryId, dto);
  }

  @Post(':repositoryId/competencies/modify_uebercompetence')
  modify(
    @GetUser('id') userId: string,
    @Param('repositoryId') repositoryId: string,
    @Body() dto: UeberCompetenceModificationDto,
  ) {
    return this.repositoryService.modifyUeberCompetence(userId, repositoryId, dto);
  }
}
