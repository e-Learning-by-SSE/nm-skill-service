import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * Creates a new feedback for a learning unit/task
 */
export class FeedbackCreationDto {

    @IsOptional()   //Needs discussion
    userID: string;
    @IsNotEmpty()
    learningUnitID: string;
    @IsNotEmpty()
    learningValue: number; 
    @IsNotEmpty()
    presentation: number;
    @IsNotEmpty()
    comprehensiveness: number;
    @IsNotEmpty()
    structure: number;
    @IsNotEmpty()
    overallRating: number;
    @IsOptional()
    optionalTextComment?: string;


    /**
     * Constructor for a feedback object.
     * @param userID The unique id of the user giving the feedback
     * @param learningUnitID The unique id of the learning unit receiving the feedback
     * @param learningValue Measures in stars (1-5) how good the learning value the learning unit is
     * @param presentation Measures in stars (1-5) how well presented the learning unit is
     * @param comprehensiveness Measures in stars (1-5) how easily understandable the learning unit is
     * @param structure Measures in stars (1-5) how well was the content structured (including length)
     * @param overallRating Measures in stars (1-5) the overall rating for the learning unit
     * @param optionalTextComment Optional text comment for giving additional feedback about the learning unit
     */
    constructor(
        userID: string,
        learningUnitID: string,
        learningValue: number,
        presentation: number,
        comprehensiveness: number,
        structure: number,
        overallRating: number,
        optionalTextComment: string | null,
    ) {
        this.userID = userID;
        this.learningUnitID = learningUnitID;
        this.learningValue = learningValue;
        this.presentation = presentation;
        this.comprehensiveness = comprehensiveness;
        this.structure = structure;
        this.overallRating = overallRating;
        this.optionalTextComment = optionalTextComment ?? undefined;
    }
}
