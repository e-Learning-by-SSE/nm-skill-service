import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import {
    CreateEmptyPathRequestDto,
    LearningPathDto,
    LearningPathListDto,
    PreferredPathDto,
} from "./dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { LearningUnit, computeSuggestedSkills } from "../../nm-skill-lib/src";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Prisma } from "@prisma/client";

/**
 * Service that manages the creation/update/deletion
 * @author Wenzel
 */
@Injectable()
export class LearningPathMgmtService {
    constructor(private db: PrismaService, private luFactory: LearningUnitFactory) {}

    /**
     * Adds a new empty learningPath
     * @param dto Specifies the owner of the new learning path
     * @returns The newly created learningPath
     */
    async createEmptyLearningPath(dto: CreateEmptyPathRequestDto) {
        // Create and return learningPath
        try {
            const learningPath = await this.db.learningPath.create({
                data: {
                    owner: dto.owner,
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

    // /**
    //  * Adds a new learningPath
    //  * @param userId The ID of the user who wants to create a learningPath
    //  * @param dto Specifies the learningPath to be created
    //  * @returns The newly created learningPath
    //  * @deprecated Use createEmptyLearningPath instead
    //  */
    // async createLearningPath(dto: LearningPathCreationDto) {
    //     // Create and return learningPath
    //     try {
    //         const learningPath = await this.db.learningPath.create({
    //             data: {
    //                 title: dto.title,
    //                 description: dto.description,
    //                 goals: {
    //                     create: dto.goals.map((goal) => ({
    //                         title: goal.title,
    //                         description: goal.description,
    //                         targetAudience: goal.targetAudience,
    //                         requirements: {
    //                             connect: goal.requirements.map((requirement) => ({
    //                                 id: requirement.id,
    //                             })),
    //                         },
    //                         pathTeachingGoals: {
    //                             connect: goal.pathGoals.map((goal) => ({ id: goal.id })),
    //                         },
    //                     })),
    //                 },
    //             },
    //             include: {
    //                 goals: true,
    //             },
    //         });

    //         return LearningPathDto.createFromDao(learningPath);
    //     } catch (error) {
    //         if (error instanceof PrismaClientKnownRequestError) {
    //             // unique field already exists
    //             if (error.code === "P2002") {
    //                 throw new ForbiddenException("LearningPath already exists");
    //             }
    //         }
    //         throw error;
    //     }
    // }

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

    public async loadLearningPathList(where?: Prisma.LearningPathWhereInput) {
        const learningPathList = new LearningPathListDto();
        learningPathList.learningPaths = await this.loadLearningPaths(where);
        return learningPathList;
    }

    public async loadLearningPaths(where?: Prisma.LearningPathWhereInput) {
        const learningPaths = await this.db.learningPath.findMany({
            where,
            include: {
                goals: true,
            },
        });

        if (!learningPaths) {
            throw new NotFoundException("Can not find any learningPaths");
        }

        return learningPaths.map((learningPath) => LearningPathDto.createFromDao(learningPath));
    }

    /**
     * Specifies a preferred ordering of the learning units (for a learning path).
     * This is done by taking the taught skills of predecessor units and adding them as suggested skills to the following units, omitting skills that are already specified as requirements.
     * @param learningPathId The ID of the learning path for which the ordering should be defined. Re-using the same ID will overwrite the previous ordering.
     * @param dto The ordering of the learning units, which shall be defined.
     */
    public async definePreferredPath(dto: PreferredPathDto, preferredPathId: string) {
        const learningUnits = await this.luFactory.getLearningUnits({
            id: {
                in: dto.learningUnits,
            },
        });

        if (!learningUnits) {
            throw new NotFoundException("Can not find any learningUnits");
        } else if (learningUnits.length !== dto.learningUnits.length) {
            const missingIds = dto.learningUnits.filter(
                (requestedId) =>
                    !learningUnits.some((learningUnit) => learningUnit.id === requestedId),
            );
            throw new NotFoundException(`Can not find all LearningUnits. Missing: ${missingIds}`);
        }

        // Order learningUnits by the given ID list
        learningUnits.sort((a, b) => {
            return dto.learningUnits.indexOf(a.id) - dto.learningUnits.indexOf(b.id);
        });

        await computeSuggestedSkills(
            learningUnits,
            async (lu: LearningUnit, missingSkills: string[]) => {
                if (missingSkills.length > 0) {
                    const updateQuery: Prisma.PreferredOrderingUncheckedUpdateWithoutLearningUnitInput &
                        Prisma.PreferredOrderingUncheckedCreateWithoutLearningUnitInput = {
                        orderId: preferredPathId,
                        suggestedSkills: {
                            connect: missingSkills.map((skillId) => ({ id: skillId })),
                        },
                    };

                    // Update / Overwrite order-constraint for the given preferredPathId
                    await this.db.learningUnit.update({
                        where: {
                            id: lu.id,
                        },

                        data: {
                            orderings: {
                                upsert: {
                                    where: {
                                        learningUnitId_orderId: {
                                            learningUnitId: lu.id,
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
                            id: lu.id,
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
            },
        );
    }
}
