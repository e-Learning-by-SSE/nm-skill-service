import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreationDto } from "./dto";

@ApiTags("Feedback")
@Controller("")
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    /**
     * Lists all available feedback for the respective learning unit.
     * @param learningUnitId The ID of the respective learning unit.
     * @returns List of all feedback for the respective learning unit.
     */
    @Get("learning-units/:learningUnitId/feedbacks/")
    listFeedback(@Param("learningUnitId") learningUnitId: string) {
        return this.feedbackService.loadAllFeedback(learningUnitId);
    }

    /**
     * Returns the specified feedback.
     * @param feedbackId The ID of the feedback to be returned
     * @returns The specified feedback.
     */
    @Get("feedbacks/:feedbackId")
    getFeedback(@Param("feedbackId") feedbackId: string) {
        return this.feedbackService.getFeedback(feedbackId);
    }

    /**
     * Creates a new feedback and returns it for the respective learning unit.
     * @param dto The feedback description (contains learning unit id)
     * @returns The created feedback for the respective learning unit.
     */
    @Post("feedbacks/")
    addFeedback(@Body() dto: FeedbackCreationDto) {
        return this.feedbackService.createFeedback(dto);
    }

    /**
     * Deletes the specified feedback from the database
     * @param feedbackId The unique database id of the feedback to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    @Delete("feedbacks/:feedbackId")
    deleteFeedback(@Param("feedbackId") feedbackId: string) {
        return this.feedbackService.deleteFeedbackById(feedbackId);
    }
}
