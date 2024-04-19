import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import {
    LearningHistoryCreationDto,
    ConsumedUnitUpdateDto,
    ConsumedUnitDto,
} from "./dto";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { STATUS } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

/**
 * Service that manages the creation/update/deletion of learningHistory
 * @author Sauer
 */
@Injectable()
export class LearningHistoryService {
    private passingThreshold: number;
    constructor(private db: PrismaService, private config: ConfigService) {
        // We ensure that all defined environment variables are set
        this.passingThreshold = this.config.get("PASSING_THRESHOLD")!;
    }

    /**
     * Returns the specified LearningHistory.
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

            return "WIP" //LearningHistoryDto.createFromDao(lh);
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
                where: { userId: historyId },
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
                where: { userId: historyId },
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
     *
     * This may be called when:
     * - A user selects a computed/suggested learning path and starts learning
     * - A user selects one or more learning units to learn independently of any paths
     *
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

    /**
     * Updates the status of a consumed unit, when an user learns the unit.
     * Will automatically create a new ConsumedUnitData entry if none exists yet.
     * @param historyId The LearningHistory where to add the consumed unit data.
     * @param dto The changes to apply, undefined entries will be ignored.
     */
    async updateConsumedUnitData(historyId: string, dto: ConsumedUnitUpdateDto) {
        // Compute progress
        let state: STATUS = STATUS.OPEN;
        if (dto.testPerformance) {
            if (dto.testPerformance >= this.passingThreshold) {
                state = STATUS.FINISHED;
            } else if (dto.actualProcessingTime) {
                state = STATUS.STARTED;
            }
        }

        const updatedUnit = await this.db.consumedUnitData.upsert({
            // Check if exist
            where: {
                unitId_historyId: {
                    historyId: historyId,
                    unitId: dto.unitId,
                },
            },
            // Create if not exist
            create: {
                historyId: historyId,
                unitId: dto.unitId,
                actualProcessingTime: dto.actualProcessingTime,
                testPerformance: dto.testPerformance,
                status: state,
            },
            // Update if exist
            update: {
                actualProcessingTime: dto.actualProcessingTime,
                testPerformance: dto.testPerformance,
                status: state,
            },
            include: {
                path: true,
            },
        });

        // TODO SE: Update learned skills if status == FINISHED

        return ConsumedUnitDto.createFromDao(updatedUnit);
    }

    async deleteLearningHistoryById(historyId: string) {
        try {
            const lHistory = await this.db.learningHistory.delete({
                where: { userId: historyId },
            });

            if (!lHistory) {
                throw new NotFoundException("No learningHistory found.");
            }

            return "WIP" //LearningHistoryDto.createFromDao(lHistory);
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

    
    async deleteProgressForId(id: string) {
        const recordToDelete = await this.db.learningProgress.findUnique({
            where: {
                id: id, // Replace with the actual record ID you want to delete
            },
        });

        if (!recordToDelete) {
            // The record with the specified ID doesn't exist; handle it accordingly
            throw new NotFoundException(`Record not found: ${id}`);
        }

        const dao = await this.db.learningProgress.delete({ where: { id: id } });

        return dao;
    }

    /**
     * ToDo: What is the use case? Re-acquisition of the same skill?
     * @param userId
     * @param updateLearningProgressDto
     */
    async updateLearningProgress(userId: string, skillId: string) {
        try {
            console.log("Update of learning progress is not yet (?) implemented.");
        } catch (error) {
            throw new Error("Error updating learning progress.");
        }
    }

    /**
     * When a user acquires a skill, create a learning progress object for them (matches skill and user).
     * Currently, the same skill can be acquired multiple times. Every time there is a new learning progress entry created.
     * @param lProgressDto
     * @returns
     */
    async createProgressForUserId(userId: string, skillId: string) {
        try {
            const createEntry = await this.db.learningProgress.create({
                data: { learningHistoryId: userId, skillId: skillId }, //TODO needs to change to history id
            });
            return createEntry;
        } catch (error) {
            console.error("Error creating learning progress", error);
            throw new ForbiddenException("Error creating learning progress");
        }
    }

    async findProgressForUserId(id: string) {
        try {
            const progressEntries = await this.db.learningProgress.findMany({
                where: { learningHistoryId: id }, //TODO needs to change to history id
            });

            if (progressEntries.length === 0) {
                throw new NotFoundException("No learning progress found.");
            }

            return progressEntries;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw new Error("Error finding learning progress.");
        }
    }

    
    async editStatusForAConsumedUnitById(consumedUnitId: string, status: STATUS) {
        try {
            // Find users with the given learning unit in their learning history

            const consumed = await this.db.consumedUnitData.update({
                where: {
                    id: consumedUnitId,
                },
                data: {
                    status: status,
                },
            });
            return consumed;
        } catch (error) {
            // Handle errors

            throw new NotFoundException("Unit not Found in DB ");
        }
    }

    async createLearningPathForUser(
        userID: string,
        learningUnitsIds: string[],
        pathTeachingGoalsIds: string[],
    ) {
        let existingUserProfile = await this.db.userProfile.findUnique({
            where: { id: userID },
        });

        if (!existingUserProfile) {
            existingUserProfile = await this.db.userProfile.create({
                data: {
                    id: userID,
                },
            });
        }

        let existingUserHistory = await this.db.learningHistory.findUnique({
            where: { userId: userID },
        });
        if (!existingUserHistory) {
            existingUserHistory = await this.db.learningHistory.create({
                data: {
                    userId: userID,
                },
            });
        }

        const createdPersonalizedLearningPath = await this.db.personalizedLearningPath.create({
            data: {
                learningHistoryId: userID,
                unitSequence: {
                    connect: learningUnitsIds.map((id) => ({ id })),
                },
                pathTeachingGoals: {
                    connect: pathTeachingGoalsIds.map((id) => ({ id })),
                },
            },
        });

        return { createdPersonalizedLearningPath };
    }
    async checkStatusForUnitsInPathOfLearningHistory(learningHistoryId: string, pathId: string) {
        // Find the learning path associated with the specified learning history
        const learningPath = await this.db.personalizedLearningPath.findUnique({
            where: {
                learningHistoryId: learningHistoryId,
                id: pathId,
            },
            include: {
                unitSequence: {
                    include: {
                        unit: true,
                    },
                },
            },
        });

        if (!learningPath) {
            throw new NotFoundException(
                `Learning path ${pathId} not found for the given learning history ${learningHistoryId}.`,
            );
        }

        return learningPath.unitSequence.map((unit) => ({
            unit: unit.unit,
            status: unit.unit.status,
        }));
    }
}
