import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { CreateEmptyPathRequestDto, UpdatePathRequestDto } from "./dto";

import { LearningPathMgmtService } from "./learningPath.service";
import LoggerUtil from "../logger/logger";

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
    createEmptyLearningPath(@Body() dto: CreateEmptyPathRequestDto) {
        LoggerUtil.logInfo("LearningPathMgmtController::createEmptyLearningPath", dto);
        return this.learningpathService.createEmptyLearningPath(dto);
    }

    /**
     * Returns all LearningPaths of the specified owner (orga-id).
     * @param owner An orga-id.
     * @returns All LearningPaths of the specified owner, may be empty.
     */
    @ApiQuery({
        name: "owner",
        required: false,
        type: String,
        description: "Filter by owner if value is given, otherwise return all",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: String,
        description: "Page number - set up value if pagination is needed",
    })
    @ApiQuery({
        name: "pageSize",
        required: false,
        type: Number,
        description: "Number of items per page - set up value if pagination is needed",
    })
    @Get()
    getLearningPathsOfOwner(
        @Query("owner") owner: string,
        @Query("page") page?: string,
        @Query("pageSize") pagesize?: string,
    ) {
        LoggerUtil.logInfo("LearningPathMgmtController::getLearningPathsOfOwner", {
            owner: owner,
            page: page,
            pageSize: pagesize,
        });
        return this.learningpathService.loadLearningPathList({ owner: owner }, page, pagesize);
    }

    /**
     * Partially updates a LearningPath. This function considers a tristate logic:
     * - null: The field shall be deleted (reset to default), this is supported only by optional fields
     * - undefined: The field shall not be changed
     * - value: The field shall be updated to the given value
     *
     * To specify a suggested ordering you need to pass the affected learning unit IDs in the array "recommendedUnitSequence" in the desired order.
     * The old order will always be completely overwritten if a "recommendedUnitSequence" is defined, i.e., the recommendation of unspecified units will be deleted for this LearningPath.
     * The old order will be kept if "recommendedUnitSequence" is undefined/not passed as parameter.
     * @example
     * Default ordering of first 5 units of the first DigiMedia chapter:
     * ```json
     * {
     *   "recommendedUnitSequence": ["2001", "2002", "2005", "2003", "2004"]
     * }
     * ```
     *
     * @param pathId A learning path ID (should be created before via the POST method)
     * @param dto The new values to change for the LearningPath.
     * @returns The updated LearningPath.
     */
    @Patch(":pathId")
    updateLearningPath(@Param("pathId") pathId: string, @Body() dto: UpdatePathRequestDto) {
        LoggerUtil.logInfo("LearningPathMgmtController::updateLearningPath", {
            pathId: pathId,
            dto: dto,
        });
        return this.learningpathService.updateLearningPath(pathId, dto);
    }

    /**
     * Deletes a drafted Learning-Path or returns a 403 error.
     * @param pathId The ID of the path to be deleted.
     */
    @Delete(":pathId")
    async deleteLearningPath(@Param("pathId") pathId: string) {
        LoggerUtil.logInfo("LearningPathMgmtController::deleteLearningPath", {
            pathId: pathId,
        });

        // Need to wait for the result (e.g., exception) to ensure correct status code
        await this.learningpathService.deleteLearningPath(pathId);
    }

    /**
     * Returns the specified learningpath.
     * @param pathId The ID of the learningpath, that shall be returned
     * @returns The specified learningpath.
     */
    @Get(":pathId")
    async getLearningPath(@Param("pathId") pathId: string) {
        LoggerUtil.logInfo("LearningPathMgmtController::getLearningPath", {
            pathId: pathId,
        });
        const result = this.learningpathService.getLearningPath(pathId);

        LoggerUtil.logInfo("LearningPathMgmtController::getLearningPath", {
            response: result,
        });

        return result;
    }
}
