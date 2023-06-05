import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SkillCreationDto, SkillRepositorySearchDto, SkillRepositoryCreationDto, SkillSearchDto } from './dto';

import { SkillMgmtService } from './skill.service';
import { Prisma } from '@prisma/client';

@ApiTags('Skill')
@Controller('skill-repositories')
export class SkillMgmtController {
  constructor(private skillService: SkillMgmtService) {}

  @Post()
  searchForRepositories(@Body() dto?: SkillRepositorySearchDto) {
    // Return also repositories that contain the specified name
    const mapName: Prisma.StringFilter | null = dto?.name ? { contains: dto.name, mode: 'insensitive' } : null;

    return this.skillService.findSkillRepositories(
      dto?.page ?? null,
      dto?.pageSize ?? null,
      dto?.owner ?? null,
      mapName,
      dto?.version ?? null,
    );
  }

  /**
   * Lists all repositories of the specified user, without showing its content.
   * @param owner The user for which the repositories shall be listed.
   * @returns The repositories of the specified user.
   */
  @Get(':owner')
  listRepositories(@Param('owner') owner: string) {
    // SE: I do not expect so many repositories per user that we need pagination here
    return this.skillService.findSkillRepositories(null, null, owner, null, null);
  }

  /**
   * Returns one repository and its unresolved elements.
   * Skills and their relations are handled as IDs and need to be resolved on the client-side.
   * @returns The repositories of the specified user.
   */
  @Get('byId/:repositoryId')
  async loadRepository(@Param('repositoryId') repositoryId: string) {
    return this.skillService.loadSkillRepository(repositoryId);
  }

  /**
   * Lists all skills.
   
   * @returns List of all skills.
   */
  @Post('findSkills')
  findSkills(@Body() dto: SkillSearchDto) {
    // Return also repositories that contain the specified name
    const skillName: Prisma.StringFilter | null = dto?.name ? { contains: dto.name, mode: 'insensitive' } : null;

    return this.skillService.searchSkills(
      dto.page ?? null,
      dto.pageSize ?? null,
      skillName,
      dto?.level ?? null,
      dto?.skillMap ?? null,
    );
  }

  /**
   * Returns one resolved repository and its elements.
   * Skills and their relations are resolved at the server.
   * @returns The repositories of the specified user.
   */
  @Get('resolve/:repositoryId')
  async loadResolvedRepository(@Param('repositoryId') repositoryId: string) {
    return this.skillService.loadResolvedSkillRepository(repositoryId);
  }

  /**
   * Lists all skills.
   
   * @returns List of all skills.
   */
  @Post('resolve/findSkills')
  findSkillsResolved(@Body() dto: SkillSearchDto) {
    // Return also repositories that contain the specified name
    const skillName: Prisma.StringFilter | null = dto?.name ? { contains: dto.name, mode: 'insensitive' } : null;

    return this.skillService.searchSkillsResolved(
      dto.page ?? null,
      dto.pageSize ?? null,
      skillName,
      dto?.level ?? null,
      dto?.skillMap ?? null,
    );
  }

  /**
   * Creates a new skill repository for the specified user.
   * @param dto specifies the attributes of the new repository
   * @returns The newly created repository or an error message.
   */
  @Post('skill/create')
  createRepository(@Body() dto: SkillRepositoryCreationDto) {
    return this.skillService.createRepository(dto);
  }

  /**
   * Creates a new skill at the specified repository and returns the created skill.
   * @param repositoryId The repository at which the skill shall be added to.
   * @param dto The skill description
   * @returns The created skill.
   */
  @Post(':repositoryId/skill/add_skill')
  addSkill(@Param('repositoryId') repositoryId: string, @Body() dto: SkillCreationDto) {
    return this.skillService.createSkill(repositoryId, dto);
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

  /**
   * Returns the specified skill.
   * @param skillId The ID of the skill, that shall be returned
   * @returns The specified skill.
   */
  @Get('resolve/skill/:skillId')
  getResolvedSkill(@Param('skillId') skillId: string) {
    return this.skillService.getResolvedSkill(skillId);
  }
}
