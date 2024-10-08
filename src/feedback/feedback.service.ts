import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { FeedbackDto, FeedbackCreationDto } from "./dto";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";

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

        return FeedbackDto.createFromDao(feedback);
    }

    /**
     * Returns a List containing all existing feedback objects for the respective learning unit.
     * @returns A (possibly empty) list with all feedback objects for the respective learning unit.
     */
    public async loadAllFeedback(learningUnitId: string) {
        //If no feedbacks are found, this returns an empty array
        const feedbackFromDB = await this.db.feedback.findMany({
            where: { learningUnitId: learningUnitId }, //Filter feedback for respective learning unit
        });

        let feedbackList: FeedbackDto[] = feedbackFromDB.map((feedback) =>
            FeedbackDto.createFromDao(feedback),
        );

        return feedbackList;
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
                // Learning unit id (foreign key) does not exist
                if (error.code === "P2003") {
                    throw new NotFoundException(
                        `No learning unit \"${dto.learningUnitID}\" found.`,
                    );
                }
                throw error;
            } else if (error instanceof PrismaClientValidationError) {
                // Input validation error
                throw new BadRequestException(`Invalid input data: ${dto}`);
            }
            throw error;
        }
    }

    /**
     * Deletes the specified feedback from the database
     * @param id The unique database id of the feedback to be deleted
     * @returns True the deleted feedback
     * @throws NotFoundException if the feedback to be deleted is not found in the database
     */
    public async deleteFeedbackById(feedbackId: string) {
        try {
            const dao = await this.db.feedback.delete({ where: { id: feedbackId } });
            return FeedbackDto.createFromDao(dao);
        } catch (error) {
            throw new NotFoundException(
                `Feedback to be deleted not found in database: ${feedbackId}`,
            );
        }
    }
}
