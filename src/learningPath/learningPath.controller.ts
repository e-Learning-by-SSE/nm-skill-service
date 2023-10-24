import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateEmptyPathRequestDto, PreferredPathDto } from "./dto";

import { LearningPathMgmtService } from "./learningPath.service";

@ApiTags("LearningPath")
@Controller("learning-paths")
export class LearningPathMgmtController {
    constructor(private learningpathService: LearningPathMgmtService) {}

    /**
     * Creates a new empty learning path for the specified owner (orga-id).
     * @param dto Specifies the owner (orga-id)of the new learning path.
     * @returns The newly created learning path specification.
     */
    @Post()
    createEmptyLearningPath(dto: CreateEmptyPathRequestDto) {
        return this.learningpathService.createEmptyLearningPath(dto);
    }

    /**
     * Lists all learning paths.
     * @returns List of all learning paths.
     */
    @ApiOperation({ deprecated: true })
    @Get("showAllLearningPaths")
    listLearningPaths() {
        return this.learningpathService.loadLearningPathList();
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
     * Specifies a preferred ordering of the learning units (for a learning path).
     * @param learningPathId The ID of the learning path for which the ordering should be defined. Re-using the same ID will overwrite the previous ordering.
     * @param dto The ordering of the learning units, which shall be defined.
     * @returns 200 if the operation was successful or 404 if some of the specified learning units do not exist.
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
