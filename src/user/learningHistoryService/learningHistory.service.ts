import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { STATUS } from "@prisma/client";
import { PersonalizedLearningPathsListDto, PersonalizedPathDto } from "./dto";
import { PathEnrollment } from "./types";
import { ConflictException } from "@nestjs/common";
import LoggerUtil from "../../logger/logger";
import { LearningUnitFactory } from "../../learningUnit/learningUnitFactory";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * Service that manages updating and retrieving of a learningHistory (which stores the learned skills and the personalized paths of a user).
 * The learningHistory is created and deleted together with its user profile.
 * Updates happen via the event system, data is retrieved directly via the API.
 * @author Sauer, Gerling
 */
@Injectable()
export class LearningHistoryService {
    constructor(private db: PrismaService, private learningUnitFactory: LearningUnitFactory) {}

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
            const createEntry = await this.db.learnedSkill.upsert({
                create: {
                    LearningHistory: { connect: { userId: userId } }, //User id and its history id are the same (and the id field of the history is named userId)
                    Skill: { connect: { id: skillId } },
                },
                update: {}, // Create only if new, based on https://github.com/prisma/prisma/discussions/5815#discussioncomment-3641585
                where: {
                    skillId_learningHistoryId: {
                        learningHistoryId: userId,
                        skillId: skillId,
                    },
                },
            });
            return createEntry;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                const prismaException = error as PrismaClientKnownRequestError;
                if (prismaException.message.includes("No 'Skill' record(s)")) {
                    throw new NotFoundException(`Skill not found: ${skillId}`);
                } else if (prismaException.message.includes("No 'LearningHistory' record(s)")) {
                    throw new NotFoundException(`UserProfile not found: ${userId}`);
                }
            }
            throw new ConflictException("Error creating learned skill");
        }
    }

    /**
     * Updates the learned skills of a user (within their learning history) when a task is finished (triggered via the event system).
     * @param userID The id of the user (and its learning history) whose learned skills should be updated
     * @param taskID The id of the task that is finished (and is required to get its taught skills)
     * @returns A list of learned skills (each containing the user, the skill, and the date of acquisition)
     */
    async updateLearnedSkills(userID: string, taskID: string) {
        try {
            //Load the learning unit (MLS task equivalent) from our DB
            const lu = await this.learningUnitFactory.loadLearningUnit(taskID);
            //Get the skills taught by the learning unit
            const skills = lu.teachingGoals;

            LoggerUtil.logInfo(
                "EventService::TaskToDoInfoGetSkill",
                "LU: " + lu.toString() + " Skills: " + skills.toString(),
            );

            // Collect the learned skills matched with the user
            let learnedSkillsList = [];

            //Iterate over all skills taught by the learning unit
            for (const skill of skills) {
                //Create a new learning progress entry (that matches user and skill and saves the date of the acquisition)
                let learnedSkill = await this.addLearnedSkillToUser(userID, skill.id);

                //Add the progress entry to the result list
                learnedSkillsList.push(learnedSkill);

                LoggerUtil.logInfo(
                    "EventService::TaskToDoInfoLearnSkill:SkillAcquired",
                    userID + "," + learnedSkill.skillId + ")",
                );
            }

            LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill:Finished");

            //Return the array with all learned skills (list of learning progress objects)
            return learnedSkillsList;

            //When user, learning unit, or skill id are not existent in our DB
        } catch (error) {
            console.error(error);
            LoggerUtil.logInfo("EventService::TaskToDoInfoLearnSkill:Error", error);
            throw new ForbiddenException(
                "No skill(s) acquired, learning unit not existent or has no skills",
            );
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
                    unitSequence: {
                        include: { unitInstance: { select: { unitId: true, status: true } } }, //Id of the learning unit and state of the belonging learningUnitInstances contained in the path
                    },
                },
            });

            if (!path) {
                throw new NotFoundException(`Personalized path not found: ${pathId}`);
            }

            return PersonalizedPathDto.createFromDao(path);
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
                        personalizedPathId: createdPersonalizedLearningPath.id,
                        unitInstanceId: learningUnitInstance,
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
                            unitInstance: {
                                select: {
                                    unitId: true, //As we want to display the belonging unit, not its instance
                                    status: true,
                                },
                            },
                        },
                        orderBy: {
                            position: "asc",
                        },
                    },
                    pathTeachingGoals: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            if (!personalPath) {
                throw new ConflictException(
                    `Could not store path ${createdPersonalizedLearningPath.id} for user: ${enrollment.userId}`,
                );
            }

            return PersonalizedPathDto.createFromDao(personalPath);
        });
    }

    // Functions below still need revision //

    /**
     * Updates the status of a learning unit instance, when an user changes its status
     * Further:
     * - Updates the status of the personalized learning paths which contain the unit (IN_PROGRESS if at least one unit instance is IN_PROGRESS, FINISHED if all unit instances are FINISHED)
     * - Updates the learned skills of the user
     * @param historyId The LearningHistory/userId where to add update the status.
     * @param learningUnitId The id of the learning unit to update the status for (this needs to be mapped to the learning unit instance).
     */
    async updateLearningUnitInstanceAndPersonalizedPathStatus(
        historyId: string,
        learningUnitId: string,
        status: STATUS,
    ) {
        //This returns the ids of the personalized learning paths and the ids of the learning unit instances that contain the learning unit (with learningUnitId)
        const result = await this.db.learningUnitInstance.findMany({
            where: {
                unitId: learningUnitId,
                pathSequence: {
                    every: {
                        //Return only the unitInstances whose paths are all part of the selected learningHistory
                        personalizedPath: {
                            learningHistoryId: historyId,
                        },
                    },
                },
            },
            select: {
                id: true, //ID of the learning unit instance
                pathSequence: {
                    select: {
                        personalizedPath: {
                            select: {
                                id: true, //ID of the personalized path
                            },
                        },
                    },
                },
            },
        });

        //If the result is empty
        if (result.length === 0) {
            return (
                "No personalized path containing unit " +
                learningUnitId +
                " found for user: " +
                historyId
            );
        }

        //Iterate over every learning unit instance contained in the result and update its state
        for (let i = 0; i < result.length; i++) {
            console.log("Result: ", result[i].id);

            const unitUpdate = await this.db.learningUnitInstance.update({
                where: {
                    id: result[i].id,
                },
                data: {
                    status: status,
                },
            });
            await this.updateLearnedSkills(historyId, unitUpdate.unitId);

            //For every learning path that contains the learning unit instance, update the status
            for (let j = 0; j < result[i].pathSequence.length; j++) {
                //If status is IN_PROGRESS for at least one learning unit instance, the path status should be set to IN_PROGRESS
                if (status === STATUS.IN_PROGRESS) {
                    await this.db.personalizedLearningPath.update({
                        where: {
                            id: result[i].pathSequence[j].personalizedPath.id,
                        },
                        data: {
                            status: status,
                        },
                    });

                    //If the new status is FINISHED, the path status should be set to FINISHED only when all contained unit instances are FINISHED
                } else if (status === STATUS.FINISHED) {
                    try {
                        await this.db.personalizedLearningPath.update({
                            where: {
                                id: result[i].pathSequence[j].personalizedPath.id,
                                unitSequence: {
                                    every: {
                                        unitInstance: {
                                            status: STATUS.FINISHED,
                                        },
                                    },
                                },
                            },
                            data: {
                                status: status,
                            },
                        });
                        //This should not throw an error, as the status of the path should not be updated if not all unit instances are FINISHED
                    } catch (error) {
                        console.log("Status was not updated");
                    }
                }
            }
        }

        return "Success!";
    }
}
