import { Feedback } from "@prisma/client";
import { FeedbackCreationDto } from "./feedback-creation.dto";
import { IsNotEmpty } from "class-validator";

/**
 * Creates a new feedback
 */
export class FeedbackDto extends FeedbackCreationDto {
    @IsNotEmpty()
    feedbackID: string;

    /**
     * Constructor for a feedback object. Contains an additional id parameter.
     * @param feedbackID The unique identifier of the feedback. Normally set by the DB.
     * @param learningUnitID The unique id of the learning unit receiving the feedback
     * @param learningValue Measures in stars (1-5) how good the learning value the learning unit is
     * @param presentation Measures in stars (1-5) how well presented the learning unit is
     * @param comprehensiveness Measures in stars (1-5) how easily understandable the learning unit is
     * @param structure Measures in stars (1-5) how well was the content structured (including length)
     * @param overallRating Measures in stars (1-5) the overall rating for the learning unit
     * @param optionalTextComment Optional text comment for giving additional feedback about the learning unit
     */
    constructor(
        feedbackID: string,
        userID: string,
        learningUnitID: string,
        learningValue: number,
        presentation: number,
        comprehensiveness: number,
        structure: number,
        overallRating: number,
        optionalTextComment: string | null,
    ) {
        super(
            userID,
            learningUnitID,
            learningValue,
            presentation,
            comprehensiveness,
            structure,
            overallRating,
            optionalTextComment,
        );
        this.feedbackID = feedbackID;
    }

    static createFromDao(feedback: Feedback): FeedbackDto {
        //Creates object based on prisma model
        return new FeedbackDto(
            feedback.id,
            feedback.userId,
            feedback.learningUnitId,
            feedback.learningValue,
            feedback.presentation,
            feedback.comprehensiveness,
            feedback.structure,
            feedback.overallRating,
            feedback.optionalTextComment
        );
    }
}
