import { GetUser } from 'src/auth/decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guard';
import { CompetenceCreationDto, RepositoryCreationDto, UeberCompetenceCreationDto } from './dto';
import { RepositoryMgmtService } from './repository-mgmt.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('repository-mgmt')
@Controller('repository-mgmt')
export class RepositoryMgmtController {
  constructor(private repositoryService: RepositoryMgmtService) {}

  /**
   * Lists all repositories of the specified user.
   * @param userId The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @Get('list_repositories')
  listRepositories(@GetUser('id') userId: string) {
    return this.repositoryService.listRepositories(userId);
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

  @Post('competence/add_competence')
  addCompetence(@GetUser('id') userId: string, @Body() dto: CompetenceCreationDto) {
    return this.repositoryService.createCompetence(userId, dto);
  }

  @Post('competence/add_uebercompetence')
  addUeberCompetence(@GetUser('id') userId: string, @Body() dto: UeberCompetenceCreationDto) {
    return this.repositoryService.createUeberCompetence(userId, dto);
  }
}
