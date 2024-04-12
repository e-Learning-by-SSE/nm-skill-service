import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LearningHistoryService } from "./learningHistory.service";
import { LearningHistoryCreationDto } from "./dto/learningHistory-creation.dto";

@ApiTags("LearningHistory")
@Controller("learning-history")
export class LearningHistoryController {
    constructor(private learningHistoryService: LearningHistoryService) {}

    /**learningHistoryId
     * Creates a new learningHistory and returns it
     * @param dto The learningHistory description
     * @returns The created learningHistory
     */
    @Post("")
    addLearningHistory(@Body() dto: LearningHistoryCreationDto) {
        return this.learningHistoryService.createLearningHistory(dto);
    }

    /**
     * Returns the specified learningHistory.
     * @param learningHistoryId The ID of the learningHistory to be returned
     * @returns The specified learningHistory.
     */
    @Get(":learningHistoryId")
    getLearningHistory(@Param("learningHistoryId") learningHistoryId: string) {
        return this.learningHistoryService.getLearningHistoryById(learningHistoryId);
    }

    /**
     * Deletes the specified learningHistory from the database
     * @param learningHistoryId The unique database id of the learningHistory to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    @Delete(":learningHistoryId")
    deleteLearningHistory(@Param("learningHistoryId") learningHistoryId: string) {
        return this.learningHistoryService.deleteLearningHistoryById(learningHistoryId);
    }

    /**
     * Fetch all Computed Paths for a given LearningHistoryId
     * @param learningHistoryId
     * @returns
     */
    @ApiOperation({ summary: "Experimental (WIP)" })
    @Get(":learningHistoryId/getComputedPaths")
    async getCompPathsIdsByHistoryById(@Param("learningHistoryId") historyId: string) {
        return this.learningHistoryService.getCompPathsIdsByHistoryById(historyId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Get(":history_id/:comp_path_id")
    getCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
    ) {
        return this.learningHistoryService.getCompPathByID(historyId, compPathId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Delete(":history_id/:comp_path_id")
    delCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
    ) {
        return this.learningHistoryService.delCompPathByID(historyId, compPathId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Patch(":history_id/:comp_path_id")
    patchCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
    ) {
        return this.learningHistoryService.patchCompPathViaLearningProfileByID(
            historyId,
            compPathId,
        );
    }

    @Get(":id/learning-progress")
    async getUserLearningProgress(@Param("id") id: string) {
        // Fetch a user's learning progress by user ID
        return this.learningHistoryService.findProgressForUserId(id);
    }

    //@todo: Do we need this? Should happen via events?
    @Post(":id/learning-progress")
    async createLearningProgress(@Param("id") userId: string, @Body() skillId: string) {
        // Create a new learning progress entry for a user
        return this.learningHistoryService.createProgressForUserId(userId, skillId);
    }

    @Delete(":id/learning-progress")
    async deleteLearningProgress(@Param("id") progressId: string) {
        return this.learningHistoryService.deleteProgressForId(progressId);
    }
}
