import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreationDto } from "./dto/feedback-creation.dto";

@ApiTags("Feedback")
@Controller("feedbacks")
export class FeedbackController {
    constructor(private feedbackService: FeedbackService) {}

    /**
     * Lists all available feedback.   
     * @returns List of all feedback.
     */
    @Get("")
    listFeedback() {
        return this.feedbackService.loadAllFeedback();
    }

    /**
     * Returns the specified feedback.
     * @param feedbackId The ID of the feedback to be returned
     * @returns The specified feedback.
     */
    @Get(":feedbackId")
    getFeedback(@Param("feedbackId") feedbackId: string) {
        return this.feedbackService.getFeedback(feedbackId);
    }

//For testing: {"userID": "string", "learningUnitID": "string2", "comprehensivenessStars":3, "presentationStars":4,  "learningValueStars":3 }

    /**
     * Creates a new feedback and returns it.
     * @param dto The feedback description
     * @returns The created feedback.
     */
    @Post("")
    addFeedback(@Body() dto: FeedbackCreationDto) {
        return this.feedbackService.createFeedback(dto);
    }

    /**
     * Deletes the specified feedback from the database
     * @param feedbackId The unique database id of the feedback to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    @Delete(":feedbackId")
    deleteFeedback(@Param("feedbackId") feedbackId: string) {
        return this.feedbackService.deleteFeedbackById(feedbackId);
    }

}