import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreationDto } from "./dto/feedback-creation.dto";

@ApiTags("Feedback")
@Controller("learning-units/{learningUnitId}/feedbacks/")
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    /**
     * Lists all available feedback for the respective learning unit.   
     * @param learningUnitId The ID of the respective learning unit.
     * @returns List of all feedback for the respective learning unit.
     */
    @Get("")
    listFeedback(@Param("learningUnitId") learningUnitId: string) {
        return this.feedbackService.loadAllFeedback(learningUnitId);
    }

    /**
     * Returns the specified feedback.
     * @param feedbackId The ID of the feedback to be returned
     * @returns The specified feedback.
     */
    @Get("{feedbackId}")
    getFeedback(@Param("learningUnitId") learningUnitId: string, @Param("feedbackId") feedbackId: string) {
        return this.feedbackService.getFeedback(feedbackId);
    }

    /**
     * Creates a new feedback and returns it for the respective learning unit.
     * @param dto The feedback description (contains learning unit id)
     * @returns The created feedback for the respective learning unit.
     */
    @Post("")
    addFeedback(@Param("learningUnitId") learningUnitId: string, @Body() dto: FeedbackCreationDto) {
        return this.feedbackService.createFeedback(dto);
    }

    /**
     * Deletes the specified feedback from the database
     * @param feedbackId The unique database id of the feedback to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    @Delete("{feedbackId}")
    deleteFeedback(@Param("learningUnitId") learningUnitId: string, @Param("feedbackId") feedbackId: string) {
        return this.feedbackService.deleteFeedbackById(feedbackId);
    }

}