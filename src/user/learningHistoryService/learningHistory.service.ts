import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { STATUS } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { LearningUnitInstanceDto } from "./dto/learningUnitInstance.dto";
import { PersonalizedLearningPathsListDto } from "./dto/personalizedLearningPathsList.dto";
import { PersonalizedPathDto } from "./dto/personalizedPath.dto";
import { PathEnrollment } from "./types";
import { ConflictException } from "@nestjs/common";

/**
 * Service that manages updating and retrieving of a learningHistory (which stores the learned skills and the personalized paths of a user).
 * The learningHistory is created and deleted together with its user profile.
 * Updates happen via the event system, data is retrieved directly via the API.
 * @author Sauer, Gerling
 */
@Injectable()
export class LearningHistoryService {
    // The threshold for passing a test
    private passingThreshold: number;

    constructor(private db: PrismaService, private config: ConfigService) {
        // We ensure that all defined environment variables are set, otherwise we use a default value
        this.passingThreshold = this.config.get("PASSING_THRESHOLD") || 0.5;
    }

    /** Returns a list containing the ids of all learned skills of a user.
     * The list can contain duplicates, as a user can acquire a skill multiple times.
     * The entries are sorted descending by the creation date (so that the newest acquired skill appears first).
     * @param userId The id of the user (and ist learning history) whose learned skills are to be returned
     * @returns A list of learned skill ids
     */
    async getLearnedSkillsOfUser(userId: string) {
        try {
            const learnedSkills = await this.db.learnedSkill.findMany({
                where: { learningHistoryId: userId },
                orderBy: { createdAt: "desc" },
            });

            return learnedSkills.map((learnedSkill) => learnedSkill.skillId);
        } catch (error) {
            console.error("Error finding learned skills for user: " + userId, error);
            throw new ForbiddenException("Error finding learned skills for user: " + userId);
        }
    }

    /**
     * When a user acquires a skill, create a learnedSkill object for them (matches skill and user (via their learning history)).
     * Currently, the same skill can be acquired multiple times. Every time there is a new learnedSkill entry created.
     * Triggered via the event system.
     * @param userId The id of the user who learned the skill (same as their history id)
     * @param skillId The id of the skill that was learned
     * @returns The created learnedSkill object
     */
    async addLearnedSkillToUser(userId: string, skillId: string) {
        try {
            // The created entry automatically gets a unique id and a creation date
            const createEntry = await this.db.learnedSkill.create({
                data: {
                    LearningHistory: { connect: { userId: userId } }, //User id and its history id are the same (and the id field of the history is named userId)
                    Skill: { connect: { id: skillId } },
                },
            });
            return createEntry;
        } catch (error) {
            throw new ForbiddenException("Error creating learned skill");
        }
    }

    /**
     * Returns the personalized learning paths of a user.
     * @param userId The id of the user (and its learning history) whose personalized paths are to be returned
     * @param status The status of the paths to be returned (optional)
     * @returns A list of personalized learning paths of a user, reduced to their id, the learningPathId (if existent), and their status
     */
    async getPersonalizedPathsOfUser(userId: string, status?: STATUS) {
        try {
            const paths = await this.db.personalizedLearningPath.findMany({
                where: { learningHistoryId: userId, status: status }, //UserId equals historyId
                select: { id: true, learningPathId: true, status: true },
                orderBy: { updatedAt: "desc" },
            });

            //Create the DTO
            const pathDto = PersonalizedLearningPathsListDto.createFromDao(paths);

            return pathDto;
        } catch (error) {
            throw new ForbiddenException("Error finding personalized paths for user: " + userId);
        }
    }

    /**
     * Returns the personalized learning path of a user.
     * @param pathId The id of the personalized learning path to be returned.
     * @returns The personalized learning path of a user
     */
    async getPersonalizedPath(pathId: string) {
        try {
            const path = await this.db.personalizedLearningPath.findUnique({
                where: { id: pathId },
                include: {
                    pathTeachingGoals: { select: { id: true } }, //Ids of the taught skills
                    unitSequence: { include: { unit: { select: { id: true, status: true } } } }, //Id and state of the learningUnitInstances contained in the path
                },
            });

            if (path) {
                //Create the DTO
                const pathDto = PersonalizedPathDto.createFromDao(path);

                return pathDto;
            }
        } catch (error) {
            throw new ForbiddenException("Error finding personalized path: " + pathId);
        }
    }

    /**
     * Adds a new personalized learning path to a user.
     * The personalized learning path needs exactly one origin to be created:
     * 1.) a predefined path by passing the pathId as parameter
     * 2.) a self-created path by passing the pathTeachingGoalsIds as parameter
     *
     * @param enrollment user, personalized selection of learning units and the origin of the selection
     * @returns The created personalized learning path (including the sequence of learning units and the origin of the selection)
     */
    async addPersonalizedLearningPathToUser(enrollment: PathEnrollment) {
        // Transaction to ensure atomicity
        return this.db.$transaction(async (tx) => {
            // 1. Create the personalized learning path
            const createdPersonalizedLearningPath = await tx.personalizedLearningPath.create({
                data: {
                    learningHistoryId: enrollment.userId,
                    learningPathId: enrollment.pathId,
                    pathTeachingGoals: {
                        connect: enrollment.pathTeachingGoalsIds?.map((id) => ({ id })),
                    },
                },
            });

            // 2. Create LearningUnitInstances if they not already exist
            Promise.all(
                enrollment.learningUnitsIds.map(async (unitId) => {
                    // Create if not exist, based on: https://github.com/prisma/prisma/discussions/5815#discussioncomment-3641585
                    await tx.learningUnitInstance.upsert({
                        where: {
                            unitId: unitId,
                        },
                        create: {
                            unitId: unitId,
                            status: STATUS.OPEN,
                        },
                        // Avoid accidental overwriting -> NOP
                        update: {},
                    });
                }),
            );

            // 3. Load LearningUnitInstance for all units
            const learningUnitInstances = await tx.learningUnitInstance.findMany({
                where: {
                    unitId: {
                        in: enrollment.learningUnitsIds,
                    },
                },
            });

            // 4. Create the path sequence
            for (let i = 0; i < enrollment.learningUnitsIds.length; i++) {
                // LearningUnitInstance.Id of the given unit
                const learningUnitInstance = learningUnitInstances.find(
                    (unit) => unit.unitId === enrollment.learningUnitsIds[i],
                )?.id;

                if (!learningUnitInstance) {
                    throw new NotFoundException(
                        `Learning unit instance for unit ${enrollment.learningUnitsIds[i]} not found`,
                    );
                }

                await tx.pathSequence.create({
                    data: {
                        pathId: createdPersonalizedLearningPath.id,
                        unitId: learningUnitInstance,
                        position: i,
                    },
                });
            }

            // 5. Return the created path
            const personalPath = await tx.personalizedLearningPath.findUnique({
                where: {
                    id: createdPersonalizedLearningPath.id,
                },
                include: {
                    unitSequence: {
                        select: {
                            // LearningUnitInstance
                            unit: {
                                select: {
                                    unitId: true,
                                    status: true,
                                },
                            },
                        },
                        orderBy: {
                            position: "asc",
                        },
                    },
                },
            });

            if (!personalPath) {
                throw new ConflictException(
                    `Could not store path ${createdPersonalizedLearningPath.id} for user: ${enrollment.userId}`,
                );
            }

            return personalPath;
        });
    }

    // Functions below still need revision //

    /**
     * Updates the status of a consumed unit, when an user learns the unit.
     * Will automatically create a new ConsumedUnitData entry if none exists yet.
     * @param historyId The LearningHistory where to add the consumed unit data.
     * @param dto The changes to apply, undefined entries will be ignored.
     */
    async updateLearningUnitInstance(historyId: string, dto: LearningUnitInstanceDto) {
        // Compute progress
        let state: STATUS = STATUS.OPEN;
        if (dto.testPerformance) {
            if (dto.testPerformance >= this.passingThreshold) {
                state = STATUS.FINISHED;
            } else if (dto.actualProcessingTime) {
                state = STATUS.IN_PROGRESS;
            }
        }

        const updatedUnit = await this.db.learningUnitInstance.upsert({
            // Check if exist
            where: {
                unitId: dto.unitId,
            },
            // Create if not exist
            create: {
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

        return LearningUnitInstanceDto.createFromDao(updatedUnit);
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
