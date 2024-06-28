import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
    SkillCreationDto,
    SkillRepositorySearchDto,
    SkillRepositoryCreationDto,
    SkillSearchDto,
    SkillRepositoryUpdateDto,
} from "./dto";
import { SkillMgmtService } from "./skill.service";
import { Prisma } from "@prisma/client";
import { SkillUpdateDto } from "./dto/skill-update.dto";
import LoggerUtil from "../logger/logger";
import { SkillRepositoryService } from "./skill-repository.service";
@ApiTags("Skill")
@Controller("skill-repositories")
export class SkillMgmtController {
    constructor(
        private skillService: SkillMgmtService,
        private repositoryService: SkillRepositoryService,
    ) {}

    @Get("/getAllSkills/")
    async getAllSkills() {
        try {
            LoggerUtil.logInfo("Skill::getAllSkills");
            return await this.skillService.loadAllSkills();
        } catch (error) {
            LoggerUtil.logError("getAllSkills", error);
            throw error;
        }
    }

    @Post()
    async searchForRepositories(@Body() dto?: SkillRepositorySearchDto) {
        try {
            LoggerUtil.logInfo("Skill::searchForRepositories");
            const mapName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            return await this.repositoryService.findSkillRepositories(
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
    async listRepositories(@Param("ownerId") owner: string) {
        try {
            LoggerUtil.logInfo("Skill::listRepositories", { ownerId: owner });
            // SE: I do not expect so many repositories per user that we need pagination here
            return await this.repositoryService.findSkillRepositories(
                null,
                null,
                owner,
                null,
                null,
            );
        } catch (error) {
            LoggerUtil.logError("Skill::listRepositories", error);
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
            LoggerUtil.logInfo("Skill::loadRepository", { repositoryId: repositoryId });
            return await this.repositoryService.loadSkillRepository(repositoryId);
        } catch (error) {
            LoggerUtil.logError("Skill::loadRepository", error);
            throw error;
        }
    }

    /**
     * Lists all skills matching given attributes.
     * @param dto Search attributes
     * @returns List of all skills matching given attributes (may be empty).
     */
    @Post("findSkills")
    async findSkills(@Body() dto: SkillSearchDto) {
        try {
            LoggerUtil.logInfo("Skill::findSkills", dto);
            // Return also repositories that contain the specified name
            const skillName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            return await this.skillService.searchSkills(
                dto.page ?? null,
                dto.pageSize ?? null,
                skillName,
                dto?.level ?? null,
                dto?.skillMap ?? null,
            );
        } catch (error) {
            LoggerUtil.logError("Skill::findSkills", error);
            throw error;
        }
    }

    // /**
    //  * Returns one resolved repository and its elements.
    //  * Skills and their relations are resolved at the server.
    //  * @returns The repositories of the specified user.
    //  */
    // @ApiOperation({ deprecated: true })
    // @Get("resolve/:repositoryId")
    // async loadResolvedRepository(@Param("repositoryId") repositoryId: string) {
    //     try {
    //         LoggerUtil.logInfo("Skill::loadResolvedRepository", { repositoryId: repositoryId });
    //         const result = await this.repositoryService.loadResolvedSkillRepository(repositoryId);
    //         LoggerUtil.logInfo("Skill::loadResolvedRepository", { response: result });
    //         return result;
    //     } catch (error) {
    //         LoggerUtil.logError("Skill::loadResolvedRepository", error);
    //         throw error;
    //     }
    // }

    /**
     * Lists all skills.
     * @returns List of all skills.
     */
    @ApiOperation({ deprecated: true })
    @Post("resolve/findSkills")
    async findSkillsResolved(@Body() dto: SkillSearchDto) {
        try {
            LoggerUtil.logInfo("Skill::findSkillsResolved", dto);
            // Return also repositories that contain the specified name
            const skillName: Prisma.StringFilter | null = dto?.name
                ? { contains: dto.name, mode: "insensitive" }
                : null;

            const result = await this.skillService.searchSkillsResolved(
                dto.page ?? null,
                dto.pageSize ?? null,
                skillName,
                dto?.level ?? null,
                dto?.skillMap ?? null,
            );

            LoggerUtil.logInfo("Skill::findSkillsResolved", { response: result });

            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::findSkillsResolved", error);
            throw error;
        }
    }

    /**
     * Creates a new skill repository for the specified user.
     * @param dto specifies the attributes of the new repository
     * @returns The newly created repository or an error message.
     */
    @Post("/create")
    async createRepository(@Body() dto: SkillRepositoryCreationDto) {
        try {
            LoggerUtil.logInfo("Skill::createRepository", dto);
            const result = await this.repositoryService.createRepository(dto);
            LoggerUtil.logInfo("Skill::createRepository", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::createRepository", error);
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
    async addSkill(@Param("repositoryId") repositoryId: string, @Body() dto: SkillCreationDto) {
        try {
            LoggerUtil.logInfo("Skill::addSkill", { repositoryId: repositoryId, dto: dto });
            const result = await this.skillService.createSkill(repositoryId, dto);
            LoggerUtil.logInfo("Skill::addSkill", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::addSkill", error);
            throw error;
        }
    }

    /**
     * Adapts a repository and returns the adapted it.
     * @param repositoryId The repository which  shall be adapted.
     * @param dto The repository description
     * @returns The adapted repository.
     */
    @Patch(":repositoryId")
    async adaptRepo(
        @Param("repositoryId") repositoryId: string,
        @Body() dto: SkillRepositoryUpdateDto,
    ) {
        try {
            LoggerUtil.logInfo("Skill::adaptRepo", { repositoryId: repositoryId, dto });
            const result = await this.repositoryService.adaptRepository(repositoryId, dto);
            LoggerUtil.logInfo("Skill::adaptRepo", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::adaptRepo", error);
            throw error;
        }
    }

    @Delete(":repositoryId")
    async deleteRepo(@Param("repositoryId") repositoryId: string) {
        try {
            LoggerUtil.logInfo("Skill::deleteRepo", { repositoryId: repositoryId });
            const result = await this.repositoryService.deleteRepository(repositoryId);
            LoggerUtil.logInfo("Skill::deleteRepo", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::deleteRepo", error);
            throw error;
        }
    }

    /**
     * Returns the specified skill.
     * @param skillId The ID of the skill, that shall be returned
     * @returns The specified skill.
     */
    @Get("skill/:skillId")
    async getSkill(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("Skill::getSkill", { skillId: skillId });
            const result = await this.skillService.getSkill(skillId);
            LoggerUtil.logInfo("Skill::getSkill", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::getSkill", error);
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
    async getResolvedSkill(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("Skill::getResolvedSkill", { skillId: skillId });
            const result = await this.skillService.getResolvedSkill(skillId);
            LoggerUtil.logInfo("Skill::getResolvedSkill", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::getResolvedSkill", error);
            throw error;
        }
    }
    /**
     * Updates a skill as follows:
     * - First: It will update all values of the skill (name, level, description, nestedSkills, parentSkills)
     * - Second: It will move the skill to another repository, if a new repositoryId is specified
     * <br> - In this case, all nested skills will be moved to the new repository as well
     * <br> - None of the skills may be used in a learning unit
     * <br> - None of the skills may have an additional parent, which is not moved to the new repository
     *
     * For the update the following rules apply:
     * - If a value is undefined, it will not be changed
     * - If a value is null, it will be cleared / set to default
     * - If a value is specified, it will be set to the specified value
     * @param repositoryId The repository at which the skill shall be added to.
     * @param dto The skill description
     * @returns The updated skill or in case of a movement operation all affected skills
     */
    @Patch("/skill/:skillId")
    async updateSkill(@Param("skillId") skillId: string, @Body() dto: SkillUpdateDto) {
        try {
            LoggerUtil.logInfo("Skill::updateSkill", dto);
            const result = await this.skillService.updateSkill(skillId, dto);
            LoggerUtil.logInfo("Skill::updateSkill", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::updateSkill", error);
            throw error;
        }
    }

    /**
     * Deletes a skill without checking if it is already used (e.g., in a learning unit).
     * **Warning:** This method may lead to data inconsistency if the skill is already used.
     * Please use `deleteWithCheck` instead.
     * @param skillId The skill to be deleted
     * @returns The deleted skill or `404` if the skill does not exist
     */
    @Delete("/skill/deleteWithoutCheck/:skillId")
    async deleteSkillWithoutCheck(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("Skill::deleteSkillWithoutCheck", { skillId: skillId });
            const result = await this.skillService.deleteSkillWithoutCheck(skillId);
            LoggerUtil.logInfo("Skill::deleteSkillWithoutCheck", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::deleteSkillWithoutCheck", error);
            throw error;
        }
    }

    @Delete("/skill/deleteWithCheck/:skillId")
    async deleteSkillWithCheck(@Param("skillId") skillId: string) {
        try {
            LoggerUtil.logInfo("Skill::deleteSkillWithCheck", { skillId: skillId });
            const result = await this.skillService.deleteSkillWithCheck(skillId);
            LoggerUtil.logInfo("Skill::deleteSkillWithCheck", { response: result });
            return result;
        } catch (error) {
            LoggerUtil.logError("Skill::deleteSkillWithCheck", error);
            throw error;
        }
    }
}
