import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningHistoryService } from "./learningHistory.service";
import { LearningHistoryCreationDto } from "./dto/learningHistory-creation.dto";


@ApiTags("LearningHistory")
@Controller("")
export class LearningHistoryController {
    constructor(private learningHistoryService: LearningHistoryService) {}

    /**
     * Returns the specified learningHistory.
     * @param learningHistoryId The ID of the learningHistory to be returned
     * @returns The specified learningHistory.
     */
    @Get(":getLearningHistoryById")
    getLearningHistory(@Param("getLearningHistoryById") learningHistoryId: string) {
        return this.learningHistoryService.getLearningHistoryById(learningHistoryId);
    }

    /**learningHistoryId
     * Creates a new learningHistory and returns it
     * @param dto The learningHistory description
     * @returns The created learningHistory
     */
    @Post("add_LearningHistory")
    addLearningHistory(@Body() dto: LearningHistoryCreationDto) {
        return this.learningHistoryService.createLearningHistory(dto);
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

}