import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import {
    SkillCreationDto,
    SkillRepositorySearchDto,
    SkillRepositoryCreationDto,
    SkillSearchDto,
    SkillRepositoryDto,
    SkillDto,
} from "./dto";

import { SkillMgmtService } from "./skill.service";
import { Prisma } from "@prisma/client";
import { SkillUpdateDto } from "./dto/skill-update.dto";

import LoggerUtil from "../logger/logger";
@ApiTags("Skill")
@Controller("skill-repositories")
export class SkillMgmtController {
    constructor(private skillService: SkillMgmtService) {}

    @Get("/getAllSkills/")
    getAllSkills() {
        try {
            LoggerUtil.logInfo("getAllSkills", "Retrieving all skills");
            return this.skillService.loadAllSkills();
        } catch (error) {
            LoggerUtil.logError("getAllSkills", error);
            throw error;
        }
    }

    @Post()
    searchForRepositories(@Body() dto?: SkillRepositorySearchDto) {
        try {
            LoggerUtil.logInfo("searchForRepositories", "Searching for repositories");
            const mapName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            return this.skillService.findSkillRepositories(
                dto?.page ?? null,
                dto?.pageSize ?? null,
                dto?.owner ?? null,
                mapName,
                dto?.version ?? null,
            );
        } catch (error) {
            LoggerUtil.logError("searchForRepositories", error);
            throw error;
        }
    }

    /**
     * Lists all repositories of the specified user, without showing its content.
     * @param owner The user for which the repositories shall be listed.
     * @returns The repositories of the specified user.
     */
    @Get("byOwner/:ownerId")
    listRepositories(@Param("ownerId") owner: string) {
        try {
            LoggerUtil.logInfo("listRepositories", `Listing repositories for owner ${owner}`);
            // SE: I do not expect so many repositories per user that we need pagination here
            return this.skillService.findSkillRepositories(null, null, owner, null, null);
        } catch (error) {
            LoggerUtil.logError("listRepositories", error);
            throw error;
        }
    }

    /**
     * Returns one repository and its unresolved elements.
     * Skills and their relations are handled as IDs and need to be resolved on the client-side.
     * @returns The repositories of the specified user.
     */
    @Get("byId/:repositoryId")
    async loadRepository(@Param("repositoryId") repositoryId: string) {
        try {
            LoggerUtil.logInfo("loadRepository", `Loading repository with ID ${repositoryId}`);
            return this.skillService.loadSkillRepository(repositoryId);
        } catch (error) {
            LoggerUtil.logError("loadRepository", error);
            throw error;
        }
    }

    /**
   * Lists all skills matching given attributes.
   
   * @returns List of all skills matching given attributes.
   */
    @Post("findSkills")
    findSkills(@Body() dto: SkillSearchDto) {
        try {
            LoggerUtil.logInfo("findSkills", "Searching for skills with attributes:${dto}");
            // Return also repositories that contain the specified name
            const skillName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            return this.skillService.searchSkills(
                dto.page ?? null,
                dto.pageSize ?? null,
                skillName,
                dto?.level ?? null,
                dto?.skillMap ?? null,
            );
        } catch (error) {
            LoggerUtil.logError("findSkills", error);
            throw error;
        }
    }

    /**
     * Returns one resolved repository and its elements.
     * Skills and their relations are resolved at the server.
     * @returns The repositories of the specified user.
     */
    @ApiOperation({ deprecated: true })
    @Get("resolve/:repositoryId")
    async loadResolvedRepository(@Param("repositoryId") repositoryId: string) {
        try {
            LoggerUtil.logInfo(
                "loadResolvedRepository",
                `Loading resolved repository with ID ${repositoryId}`,
            );
            const result = await this.skillService.loadResolvedSkillRepository(repositoryId);
            LoggerUtil.logInfo(
                "loadResolvedRepository",
                `Successfully loaded resolved repository with ID ${repositoryId}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("loadResolvedRepository", error);
            throw error;
        }
    }
    /**
   * Lists all skills.
   
   * @returns List of all skills.
   */
    @ApiOperation({ deprecated: true })
    @Post("resolve/findSkills")
    findSkillsResolved(@Body() dto: SkillSearchDto) {
        try {
            LoggerUtil.logInfo(
                "findSkillsResolved",
                `Searching for resolved skills with attributes: ${JSON.stringify(dto)}`,
            );
            // Return also repositories that contain the specified name
            const skillName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            const result = this.skillService.searchSkillsResolved(
                dto.page ?? null,
                dto.pageSize ?? null,
                skillName,
                dto?.level ?? null,
                dto?.skillMap ?? null,
            );

            LoggerUtil.logInfo(
                "findSkillsResolved",
                `Successfully found resolved skills with attributes: ${JSON.stringify(dto)}`,
            );

            return result;
        } catch (error) {
            LoggerUtil.logError("findSkillsResolved", error);
            throw error;
        }
    }

    /**
     * Creates a new skill repository for the specified user.
     * @param dto specifies the attributes of the new repository
     * @returns The newly created repository or an error message.
     */
    @Post("/create")
    createRepository(@Body() dto: SkillRepositoryCreationDto) {
        try {
            LoggerUtil.logInfo(
                "createRepository",
                `Creating a new skill repository with attributes: ${JSON.stringify(dto)}`,
            );
            const result = this.skillService.createRepository(dto);
            LoggerUtil.logInfo(
                "createRepository",
                `Successfully created a new skill repository with attributes: ${JSON.stringify(
                    dto,
                )}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("createRepository", error);
            throw error;
        }
    }

    /**
     * Creates a new skill at the specified repository and returns the created skill.
     * @param repositoryId The repository at which the skill shall be added to.
     * @param dto The skill description
     * @returns The created skill.
     */
    @Post(":repositoryId/skill/add_skill")
    addSkill(@Param("repositoryId") repositoryId: string, @Body() dto: SkillCreationDto) {
        try {
            LoggerUtil.logInfo(
                "addSkill",
                `Adding a new skill to repository ${repositoryId} with attributes: ${JSON.stringify(
                    dto,
                )}`,
            );
            const result = this.skillService.createSkill(repositoryId, dto);
            LoggerUtil.logInfo(
                "addSkill",
                `Successfully added a new skill to repository ${repositoryId} with attributes: ${JSON.stringify(
                    dto,
                )}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("addSkill", error);
            throw error;
        }
    }

    /**
     * Adapts a repository and returns the adapted it.
     * @param repositoryId The repository which  shall be adapted.
     * @param dto The repository description
     * @returns The adapted repository.
     */
    @Post("repository/adapt")
    adaptRepo(@Body() dto: SkillRepositoryDto) {
        try {
            LoggerUtil.logInfo(
                "adaptRepo",
                `Adapting repository with attributes: ${JSON.stringify(dto)}`,
            );
            const result = this.skillService.adaptRepository(dto);
            LoggerUtil.logInfo(
                "adaptRepo",
                `Successfully adapted repository with attributes: ${JSON.stringify(dto)}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("adaptRepo", error);
            throw error;
        }
    }

    @Delete(":repositoryId")
    deleteRepo(@Param("repositoryId") repositoryId: string) {
        try {
            LoggerUtil.logInfo("deleteRepo", `Deleting repository with ID: ${repositoryId}`);
            const result = this.skillService.deleteRepository(repositoryId);
            LoggerUtil.logInfo(
                "deleteRepo",
                `Successfully deleted repository with ID: ${repositoryId}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("deleteRepo", error);
            throw error;
        }
    }

    /**
     * Returns the specified skill.
     * @param skillId The ID of the skill, that shall be returned
     * @returns The specified skill.
     */
    @Get("skill/:skillId")
    getSkill(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("getSkill", `Retrieving skill with ID: ${skillId}`);
            const result = this.skillService.getSkill(skillId);
            LoggerUtil.logInfo("getSkill", `Successfully retrieved skill with ID: ${skillId}`);
            return result;
        } catch (error) {
            LoggerUtil.logError("getSkill", error);
            throw error;
        }
    }

    /**
     * Returns the specified skill.
     * @param skillId The ID of the skill, that shall be returned
     * @returns The specified skill.
     */
    @ApiOperation({ deprecated: true })
    @Get("resolve/skill/:skillId")
    getResolvedSkill(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("getResolvedSkill", `Retrieving resolved skill with ID: ${skillId}`);
            const result = this.skillService.getResolvedSkill(skillId);
            LoggerUtil.logInfo(
                "getResolvedSkill",
                `Successfully retrieved resolved skill with ID: ${skillId}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("getResolvedSkill", error);
            throw error;
        }
    }
    /**
     * Adapts a skill at the specified repository and returns the adapted skill.
     * @param repositoryId The repository at which the skill shall be added to.
     * @param dto The skill description
     * @returns The created skill.
     */
    @Put("/skill/adapt_skill")
    adaptSkill(@Body() dto: SkillUpdateDto) {
        try {
            LoggerUtil.logInfo("adaptSkill", `Adapting skill with ID: ${dto.id}`);
            const result = this.skillService.adaptSkill(dto);
            LoggerUtil.logInfo("adaptSkill", `Successfully adapted skill with ID: ${dto.id}`);
            return result;
        } catch (error) {
            LoggerUtil.logError("adaptSkill", error);
            throw error;
        }
    }
    @Delete("/skill/deleteWithoutCheck/:skillId")
    deleteSkillWithoutCheck(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo(
                "deleteSkillWithoutCheck",
                `Deleting skill without check with ID: ${skillId}`,
            );
            const result = this.skillService.deleteSkillWithoutCheck(skillId);
            LoggerUtil.logInfo(
                "deleteSkillWithoutCheck",
                `Successfully deleted skill without check with ID: ${skillId}`,
            );
            return result;
        } catch (error) {
            LoggerUtil.logError("deleteSkillWithoutCheck", error);
            throw error;
        }
    }

    @Delete("/skill/deleteWithCheck/:skillId")
    deleteSkillWithCheck(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo('deleteSkillWithCheck', `Deleting skill with check with ID: ${skillId}`);
            const result = this.skillService.deleteSkillWithCheck(skillId);
            LoggerUtil.logInfo('deleteSkillWithCheck', `Successfully deleted skill with check with ID: ${skillId}`);
            return result;
        } catch (error) {
            LoggerUtil.logError('deleteSkillWithCheck', error);
            throw error;
        }
    }
}
