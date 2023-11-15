import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { FeedbackCreationDto } from "./dto/feedback-creation.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { FeedbackDto } from "./dto/feedback.dto";
import { FeedbackListDto } from "./dto/feedback-list.dto";

/**
 * Service that manages the creation/update/deletion of feedback
 * @author Gerling
 */
@Injectable()
export class FeedbackService {
    constructor(private db: PrismaService) {}

    /**
     * Returns the specified feedback.
     * @param feedbackId The ID of the requested feedback
     * @returns Either the feedback with the specified ID, or null?
     */
    public async getFeedback(feedbackId: string) {
        const feedback = await this.db.feedback.findUnique({
            where: {
                id: feedbackId,
            },
        });

        if (!feedback) {
            throw new NotFoundException("Specified feedback not found: " + feedbackId);
        }

        return feedback;
    }

    /**
     * Returns a List containing all existing feedback objects for the respective learning unit.
     * @returns A (possibly empty) list with all feedback objects for the respective learning unit.
     */
    public async loadAllFeedback(learningUnitId: string) {
        //If no feedbacks are found, this returns an empty array
        const feedbackFromDB = await this.db.feedback.findMany({
            where: { learningUnitId:learningUnitId},    //Filter feedback for respective learning unit
          });

        const feedbackList = new FeedbackListDto();
        feedbackList.feedback = feedbackFromDB.map((feedback) => FeedbackDto.createFromDao(feedback));

        return feedbackFromDB;
    }

    /**
     * Creates a new feedback
     * @param dto Specifies the feedback to be created
     * @returns The newly created feedback
     */
    public async createFeedback(dto: FeedbackCreationDto) {
        // Create and return a new feedback based on the input data (dto) of the website
        try {
            const feedbackModel = await this.db.feedback.create({
                //Properties with default values in the prisma schema will be created accordingly without mentioning them here (like the id)
                data: {
                    userId: dto.userID,
                    learningUnitId: dto.learningUnitID,
                    learningValue: dto.learningValue,
                    presentation: dto.presentation,
                    comprehensiveness: dto.comprehensiveness,
                    structure: dto.structure,
                    overallRating: dto.overallRating,
                    optionalTextComment: dto.optionalTextComment,
                },
            });

            return FeedbackDto.createFromDao(feedbackModel);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // Unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Feedback already exists");
                }
                // Learning unit id (foreign key) does not exist
                if (error.code === "P2003") {
                    throw new ForbiddenException("No learning unit with this is exists");
                }
            }
            throw error;
        }
    }

    /**
     * Deletes the specified feedback from the database
     * @param id The unique database id of the feedback to be deleted
     * @returns True if deletion was successful, false otherwise
     */
    public async deleteFeedbackById(feedbackId: string) {
        try {
            await this.db.feedback.delete({ where: { id: feedbackId } });
            return true;
        } catch (error) {
            throw new NotFoundException(`Feedback to be deleted not found in database: ${feedbackId}`);
            return false;
        }      
    }
}
