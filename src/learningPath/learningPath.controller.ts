import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { LearningPathCreationDto, PreferredPathDto } from "./dto";

import { LearningPathMgmtService } from "./learningPath.service";
import { PreferredOrdering } from "@prisma/client";

@ApiTags("LearningPath")
@Controller("learning-paths")
export class LearningPathMgmtController {
    constructor(private learningpathService: LearningPathMgmtService) {}

    /**
   * Lists all learning paths.
   
   * @returns List of all learning paths.
   */
    @Get("showAllLearningPaths")
    listLearningPaths() {
        return this.learningpathService.loadAllLearningPaths();
    }

    /**
     * Creates a new learningpath at the specified repository and returns the created learningpath.
     * @param userId The owner of the repository
     * @param repositoryId The repository at which the learningpath shall be added to.
     * @param dto The learningpath description
     * @returns The created learningpath.
     */
    @Post("add_learningpath")
    addLearningpath(@Body() dto: LearningPathCreationDto) {
        return this.learningpathService.createLearningPath(dto);
    }

    /**
     * Returns the specified learningpath.
     * @param learningpathId The ID of the learningpath, that shall be returned
     * @returns The specified learningpath.
     */
    @Get(":learningpathId")
    getLearningPath(@Param("learningpathId") learningpathId: string) {
        return this.learningpathService.getLearningPath(learningpathId);
    }

    /**
     *
     * @param learningPathId
     * @param dto
     * @returns
     *
     * @example
     * Default ordering of first 5 units of the first DigiMedia chapter:
     * ```json
     * {
     *   "learningUnits": ["2001", "2002", "2005", "2003", "2004"]
     * }
     * ```
     */
    @ApiOperation({ summary: "Experimental (WIP)" })
    @Put(":learningPathId/unit-sequence")
    definePreferredPath(
        @Param("learningPathId") learningPathId: string,
        @Body() dto: PreferredPathDto,
    ) {
        return this.learningpathService.definePreferredPath(dto, learningPathId);
    }
}
