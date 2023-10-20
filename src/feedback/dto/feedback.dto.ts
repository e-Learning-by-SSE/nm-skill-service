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
     * @param userID The unique id of the user giving the feedback
     * @param learningUnitID The unique id of the learning unit receiving the feedback
     * @param comprehensivenessStars Measures in stars how comprehensive the learning unit is
     * @param comprehensivenessComment Optional text comment about the comprehensiveness of the learning unit
     * @param presentationStars Measures in stars how well presented the learning unit is
     * @param presentationComment Optional text comment about the presentation of the learning unit
     * @param learningValueStars Measures in stars how good the learning value the learning unit is
     * @param learningValueComment Optional text comment about the learning value of the learning unit
     * @param otherComment Optional text comment for giving additional feedback about the learning unit
     */
    constructor(
        feedbackID: string,
        userID: string,
        learningUnitID: string,
        comprehensivenessStars: number,
        comprehensivenessComment: string | null,
        presentationStars: number,
        presentationComment: string | null,
        learningValueStars: number,
        learningValueComment: string | null,
        otherComment: string | null,
    ) {
        super(
            userID,
            learningUnitID,
            comprehensivenessStars,
            comprehensivenessComment,
            presentationStars,
            presentationComment,
            learningValueStars,
            learningValueComment,
            otherComment,
        );
        this.feedbackID = feedbackID;
    }

    static createFromDao(feedback: Feedback): FeedbackDto {
        //Creates object based on prisma model
        return new FeedbackDto(
            feedback.id,
            feedback.userId,
            feedback.learningUnitId,
            feedback.comprehensivenessStars,
            feedback.comprehensivenessComment,
            feedback.presentationStars,
            feedback.presentationComment,
            feedback.learningValueStars,
            feedback.learningValueComment,
            feedback.otherComment,
        );
    }
}
