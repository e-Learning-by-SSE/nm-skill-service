import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { PrismaService } from "../prisma/prisma.service";
import {
    LearningPathCreationDto,
    LearningPathDto,
    LearningPathListDto,
    PreferredPathDto,
} from "./dto";
import { Prisma } from "@prisma/client";

/**
 * Service that manages the creation/update/deletion
 * @author Wenzel
 */
@Injectable()
export class LearningPathMgmtService {
    constructor(private db: PrismaService) {}

    /**
     * Adds a new learningPath
     * @param userId The ID of the user who wants to create a learningPath 
     * @param dto Specifies the learningPath to be created 
     * @returns The newly created learningPath

    */
    async createLearningPath(dto: LearningPathCreationDto) {
        // Create and return learningPath
        try {
            const learningPath = await this.db.learningPath.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    goals: {
                        create: dto.goals.map((goal) => ({
                            title: goal.title,
                            description: goal.description,
                            targetAudience: goal.targetAudience,
                            requirements: {
                                connect: goal.requirements.map((requirement) => ({
                                    id: requirement.id,
                                })),
                            },
                            pathTeachingGoals: {
                                connect: goal.pathGoals.map((goal) => ({ id: goal.id })),
                            },
                        })),
                    },
                },
                include: {
                    goals: true,
                },
            });

            return LearningPathDto.createFromDao(learningPath);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("LearningPath already exists");
                }
            }
            throw error;
        }
    }

    public async getLearningPath(learningPathId: string) {
        const dao = await this.db.learningPath.findUnique({
            where: { id: learningPathId },
            include: { goals: true },
        });

        if (!dao) {
            throw new NotFoundException(`Specified learningPath not found: ${learningPathId}`);
        }

        return LearningPathDto.createFromDao(dao);
    }

    public async loadAllLearningPaths(args?: Prisma.LearningPathFindManyArgs) {
        const learningPaths = await this.db.learningPath.findMany({
            ...args,
            include: { goals: true },
        });

        if (!learningPaths) {
            throw new NotFoundException("Can not find any learningPaths");
        }

        const learningPathList = new LearningPathListDto();
        learningPathList.learningPaths = learningPaths.map((learningPath) =>
            LearningPathDto.createFromDao(learningPath),
        );

        return learningPathList;
    }

    public async definePreferredPath(dto: PreferredPathDto, preferredPathId: string) {
        const learningUnits = await this.db.learningUnit.findMany({
            where: {
                id: {
                    in: dto.learningUnits,
                },
            },
            include: {
                orderings: {
                    where: {
                        orderId: preferredPathId,
                    },
                },
                teachingGoals: true,
                requirements: true,
            },
        });

        // Order learningUnits by a list of ids
        learningUnits.sort((a, b) => {
            return dto.learningUnits.indexOf(a.id) - dto.learningUnits.indexOf(b.id);
        });

        if (!learningUnits) {
            throw new NotFoundException("Can not find any learningUnits");
        } else if (learningUnits.length !== dto.learningUnits.length) {
            const missingIds = dto.learningUnits.filter(
                (requestedId) =>
                    !learningUnits.some((learningUnit) => learningUnit.id === requestedId),
            );
            throw new NotFoundException(`Can not find all learningUnits: ${missingIds}`);
        }

        // Iterate over all learningUnits starting at index 2 and set ordering condition to previous learningUnit
        for (let i = 1; i < learningUnits.length; i++) {
            const previousUnit = learningUnits[i - 1];
            const currentUnit = learningUnits[i];
            const missingSkills = previousUnit.teachingGoals
                .map((goal) => goal.id)
                .filter(
                    (goalId) => !currentUnit.requirements.map((skill) => skill.id).includes(goalId),
                );

            if (missingSkills.length > 0) {
                console.log(`[${i}] ${currentUnit.id}: ${missingSkills.map((s) => s)}`);
                const updateQuery: Prisma.PreferredOrderingUncheckedUpdateWithoutLearningUnitInput &
                    Prisma.PreferredOrderingUncheckedCreateWithoutLearningUnitInput = {
                    orderId: preferredPathId,
                    suggestedSkills: {
                        connect: missingSkills.map((skillId) => ({ id: skillId })),
                    },
                };

                await this.db.learningUnit.update({
                    where: {
                        id: currentUnit.id,
                    },

                    data: {
                        orderings: {
                            upsert: {
                                where: {
                                    learningUnitId_orderId: {
                                        learningUnitId: currentUnit.id,
                                        orderId: preferredPathId,
                                    },
                                },
                                create: updateQuery,
                                update: updateQuery,
                            },
                        },
                    },
                });
            } else {
                // Delete old constraint if there was nothing specified
                await this.db.learningUnit.update({
                    where: {
                        id: currentUnit.id,
                    },

                    data: {
                        orderings: {
                            deleteMany: {
                                orderId: preferredPathId,
                            },
                        },
                    },
                });
            }
        }
    }
}
