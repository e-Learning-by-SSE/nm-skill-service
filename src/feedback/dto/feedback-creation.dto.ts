import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * Creates a new feedback
 */
export class FeedbackCreationDto {

    @IsNotEmpty()
    userID: string;
    @IsNotEmpty()
    learningUnitID: string;
    @IsOptional()
    comprehensivenessComment?: string;
    @IsOptional()
    presentationComment?: string;
    @IsOptional()
    learningValueComment?: string;
    @IsOptional()
    otherComment?: string;
    @IsNotEmpty()
    comprehensivenessStars: number;
    @IsNotEmpty()
    presentationStars: number;
    @IsNotEmpty()
    learningValueStars: number;

    /**
     * Constructor for a feedback object.
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
        this.userID = userID;
        this.learningUnitID = learningUnitID;
        this.comprehensivenessStars = comprehensivenessStars;
        this.comprehensivenessComment = comprehensivenessComment ?? undefined;
        this.presentationStars = presentationStars;
        this.presentationComment = presentationComment ?? undefined;
        this.learningValueStars = learningValueStars;
        this.learningValueComment = learningValueComment ?? undefined;
        this.otherComment = otherComment ?? undefined;
    }
}
