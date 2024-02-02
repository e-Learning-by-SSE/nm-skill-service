import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { LearningProfileCreationDto } from "./dto/learningProfile-creation.dto";
import { LearningProfileDto } from "./dto/learningProfile.dto";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";

/**
 * Service that manages the creation/update/deletion of learningProfile
 * @author Sauer
 */
@Injectable()
export class LearningProfileService {
    constructor(private db: PrismaService) {}

    async createLearningProfile(dto: LearningProfileCreationDto) {
        // Create the learning profile and connect it to the user profile
        try {
            const lp = await this.db.learningProfile.create({
                data: {
                    semanticDensity: dto.semanticDensity,
                    semanticGravity: dto.semanticGravity,
                    mediaType: dto.mediaType,
                    language: dto.language,
                    processingTimePerUnit: dto.processingTimePerUnit,
                    preferredDidacticMethod: dto.preferredDidacticMethod,
                    id: dto.userId,
                    user: {
                        connect: {
                            id: dto.userId,
                        },
                    },
                },
            });

            return LearningProfileDto.createFromDao(lp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    // Unique field already exists
                    throw new ForbiddenException(
                        `User ${dto.userId} has already a Learning Profile`,
                    );
                } else if (error.code === "P2025") {
                    // Foreign key constraint failed
                    throw new NotFoundException(`User ${dto.userId} does not exist`);
                }
            }
            throw error;
        }
    }

    /**
     * Returns the specified learningHistory.
     * @param learningHistoryId The ID of the requested learningHistory
     * @returns Either the learningHistory with the specified ID, or null?
     */

    async getLearningProfileByID(learningProfileId: string) {
        try {
            const profile = await this.db.learningProfile.findUnique({
                where: { id: learningProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No learning profile found.");
            }

            return profile;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }
    async deleteLearningProfileByID(learningProfileId: string) {
        try {
            const profile = await this.db.learningProfile.delete({
                where: { id: learningProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No learning profile found : " + learningProfileId);
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }
    async patchLearningProfileByID(learningProfileId: string, dto: LearningProfileDto) {
        try {
            const existingLearningProfile = await this.db.learningProfile.findUnique({
                where: { id: learningProfileId },
            });

            if (!existingLearningProfile) {
                throw new NotFoundException("Learning profile not found.");
            }
            const updatedLearningProfile = await this.db.learningProfile.update({
                where: { id: learningProfileId },
                data: {
                    semanticDensity:
                        dto.semanticDensity !== undefined
                            ? Number(dto.semanticDensity)
                            : existingLearningProfile.semanticDensity,
                    semanticGravity:
                        dto.semanticGravity !== undefined
                            ? Number(dto.semanticGravity)
                            : existingLearningProfile.semanticGravity,
                    mediaType: dto.mediaType || existingLearningProfile.mediaType,
                    language: dto.language || existingLearningProfile.language,
                    processingTimePerUnit:
                        dto.processingTimePerUnit || existingLearningProfile.processingTimePerUnit,
                },
            });

            return LearningProfileDto.createFromDao(updatedLearningProfile);
        } catch (error) {
            throw error;
        }
    }
}
