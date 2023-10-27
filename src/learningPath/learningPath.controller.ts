import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateEmptyPathRequestDto, UpdatePathRequestDto } from "./dto";

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
    createEmptyLearningPath(@Body() dto: CreateEmptyPathRequestDto) {
        return this.learningpathService.createEmptyLearningPath(dto);
    }

    /**
     * Returns all LearningPaths of the specified owner (orga-id).
     * @param owner An orga-id.
     * @returns All LearningPaths of the specified owner, may be empty.
     */
    @Get()
    getLearningPathsOfOwner(@Query("owner") owner: string) {
        return this.learningpathService.loadLearningPathList({ owner: owner });
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
        return this.learningpathService.updateLearningPath(pathId, dto);
    }

    // /**
    //  * Lists all learning paths.
    //  * @returns List of all learning paths.
    //  */
    // @ApiOperation({ deprecated: true })
    // @Get("showAllLearningPaths")
    // listLearningPaths() {
    //     return this.learningpathService.loadLearningPathList();
    // }

    /**
     * Returns the specified learningpath.
     * @param pathId The ID of the learningpath, that shall be returned
     * @returns The specified learningpath.
     */
    @Get(":pathId")
    async getLearningPath(@Param("pathId") pathId: string) {
        return this.learningpathService.getLearningPath(pathId);
    }
}
