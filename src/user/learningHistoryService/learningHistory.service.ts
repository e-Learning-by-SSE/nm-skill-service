import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningHistoryCreationDto } from "./dto/learningHistory-creation.dto";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { LearningHistoryDto } from "./dto/learningHistory.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * Service that manages the creation/update/deletion of learningHistory
 * @author Sauer
 */
@Injectable()
export class LearningHistoryService {
    constructor(private db: PrismaService) {}

    /**
     * Returns the specified feedback.
     * @param learningHistoryId The ID of the requested learningHistory
     * @returns Either the learningHistory with the specified ID, or null?
     */

    async createLearningHistory(dto: LearningHistoryCreationDto) {
        try {
            const lh = await this.db.learningHistory.create({
                data: {
                    userId: dto.userId,
                },
            });

            return LearningHistoryDto.createFromDao(lh);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Learning History could not be created");
                } else if (error.code === "P2003") {
                    throw new NotFoundException(`No user profile found with id ${dto.userId}`);
                }
            }
            throw error;
        }
    }
    async getLearningHistoryById(historyId: string) {
        try {
            const profile = await this.db.learningHistory.findUnique({
                where: { id: historyId },
            });

            if (!profile) {
                throw new NotFoundException("No learning History found.");
            }

            return profile;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }

    async deleteLearningHistoryById(historyId: string) {
        try {
            const lHistory = await this.db.learningHistory.delete({
                where: { id: historyId },
            });

            if (!lHistory) {
                throw new NotFoundException("No learningHistory found.");
            }

            return LearningHistoryDto.createFromDao(lHistory);
        } catch (error) {
            throw error;
        }
    }

    // Delete a personalizedLearningPath with a specific ID from a learningHistory with a specific ID
    async delCompPathByID(historyId: string, compPathId: string) {
        try {
            const learningHistory = await this.db.learningHistory.findUnique({
                where: { id: historyId },
                include: { personalPaths: true }, // Include personalPaths relation
            });

            if (!learningHistory) {
                throw new Error(`LearningHistory with id ${historyId} not found`);
            }

            const personalPathToDelete = learningHistory.personalPaths.find(
                (path) => path.id === compPathId,
            );

            if (!personalPathToDelete) {
                throw new Error(`PersonalPath with id ${compPathId} not found in LearningHistory`);
            }

            await this.db.personalizedLearningPath.delete({
                where: { id: compPathId },
            });
        } catch (error) {
            throw error;
        }
    }

    // Return a personalizedLearningPath with a specific ID from a learningHistory with a specific ID
    async getCompPathByID(historyId: string, compPathId: string) {
        try {
            const learningHistory = await this.db.learningHistory.findUnique({
                where: { id: historyId },
                include: { personalPaths: true }, // Include personalPaths relation
            });

            if (!learningHistory) {
                throw new Error(`LearningHistory with id ${historyId} not found`);
            }

            const personalPathToReturn = learningHistory.personalPaths.find(
                (path) => path.id === compPathId,
            );

            if (!personalPathToReturn) {
                throw new Error(`PersonalPath with id ${compPathId} not found in LearningHistory`);
            }

            return personalPathToReturn;
        } catch (error) {
            throw error;
        }
    }

    // Return all personalizedLearningPath(es) "personalPaths" from a learningHistory with a specific ID
    async getCompPathsIdsByHistoryById(historyId: string) {
        try {
            const learningHistory = await this.db.learningHistory.findUnique({
                where: { id: historyId },
                include: { personalPaths: true }, // Include personalPaths relation
            });

            if (!learningHistory) {
                throw new Error(`LearningHistory with id ${historyId} not found`);
            }

            return learningHistory.personalPaths;
        } catch (error) {
            throw error;
        }
    }

    // Patch a personalizedLearningPath with a specific ID in "personalPaths" for a learningHistory with a specific ID
    async patchCompPathAtLearningHistoryByID(historyId: string, compPathId:string, dto: LearningHistoryDto) {
        try {
            const existingLearningHistory = await this.db.learningHistory.findUnique({
                where: { id: historyId },
                include: { personalPaths: true }, // Include personalPaths relation
            });

            if (!existingLearningHistory) {
                throw new Error(`LearningHistory with id ${historyId} not found`);
            }

            const personalPathToUpdate = existingLearningHistory.personalPaths.find(
                (path) => path.id === compPathId,
            );

            // update the "personalPath" with a new array of personalizedLearningPath IDs or keep the existing entry:
            const updatedLearningHistory = await this.db.learningHistory.update({
                where: { id: historyId },
                data: {
                   // personalPaths: dto.personalPaths || existingLearningHistory.personalPaths,
                },
            });

            return LearningHistoryDto.createFromDao(updatedLearningHistory);
        } catch (error) {
            throw error;
        }
    }
}
