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

    async getCompPathsIdsByHistoryById(historyId: string) {
        try {
            const profile = await this.db.learningHistory.findUnique({
                where: { id: historyId },
            });

            if (!profile) {
                throw new NotFoundException("No learning History found.");
            }

            return profile; // Return the CompPath here
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }

    /**
     * Creates a new blank learning history for the specified learning units.
     * @param historyId The LearningHistory where to add the consumed unit data.
     * @param unitIds The IDs of the learning units for which history data shall be created for
     * @returns The created (blank) history data for the consumed units
     */
    private async createConsumedUnitData(historyId: string, unitIds: string[]) {
        // Creates ConsumedUnits and returns the number of created items
        await this.db.consumedUnitData.createMany({
            data: unitIds.map((unitId) => ({
                historyId: historyId,
                unitId: unitId,
            })),
            skipDuplicates: true,
        });

        // Returns the created items
        return this.db.consumedUnitData.findMany({
            where: {
                historyId: historyId,
                unitId: { in: unitIds },
            },
        });
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

    async delCompPathByID(historyId: string, compPathId: string) {
        throw new Error("Method not implemented.");
    }

    async getCompPathByID(historyId: string, compPathId: string) {
        throw new Error("Method not implemented.");
    }

    async patchCompPathViaLearningProfileByID(learningProfileId: string, userProfileId: string) {
        throw new Error("Method not implemented.");
    }
}
