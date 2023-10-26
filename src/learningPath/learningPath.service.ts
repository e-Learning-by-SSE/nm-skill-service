import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import {
    CreateEmptyPathRequestDto,
    LearningPathDto,
    LearningPathListDto,
    PreferredPathDto,
    UpdatePathRequestDto,
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
                    requirements: true,
                    pathTeachingGoals: true,
                    recommendedUnitSequence: true,
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

    /**
     * Partially updates a LearningPath. This function considers a tristate logic:
     * - null: The field shall be deleted (reset to default), this is supported only by optional fields
     * - undefined: The field shall not be changed
     * - value: The field shall be updated to the given value
     * @param learningPathId Specifies the LearningPath that shall be updated.
     * @param dto The new values for the LearningPath.
     * @returns The updated LearningPath.
     */
    async updateLearningPath(learningPathId: string, dto: UpdatePathRequestDto) {
        const requirements =
            dto.requirements === null ? [] : dto.requirements?.map((req) => ({ id: req }));
        const pathTeachingGoals =
            dto.pathGoals === null ? [] : dto.pathGoals?.map((goal) => ({ id: goal }));
        const unitOrder =
            dto.recommendedUnitSequence === null
                ? []
                : dto.recommendedUnitSequence?.map((unit) => ({ id: unit }));

        const result = await this.db.learningPath.update({
            where: {
                id: learningPathId,
            },
            data: {
                owner: dto.owner,
                title: dto.title,
                description: dto.description,
                targetAudience: dto.targetAudience,
                lifecycle: dto.lifecycle,
                requirements: {
                    set: requirements,
                },
                pathTeachingGoals: {
                    set: pathTeachingGoals,
                },
                recommendedUnitSequence: {
                    set: unitOrder,
                },
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
                recommendedUnitSequence: true,
            },
        });

        if (dto.recommendedUnitSequence) {
            // Define / Update preferred path
            await this.definePreferredPath(
                { learningUnits: dto.recommendedUnitSequence },
                learningPathId,
            );
        } else if (dto.recommendedUnitSequence === null) {
            // Delete preferred path
            await this.db.preferredOrdering.deleteMany({
                where: {
                    orderId: learningPathId,
                },
            });
        }

        return LearningPathDto.createFromDao(result);
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
                requirements: true,
                pathTeachingGoals: true,
                recommendedUnitSequence: true,
            },
        });

        if (!learningPaths) {
            throw new NotFoundException("Can not find any learningPaths");
        }

        return learningPaths.map((learningPath) => LearningPathDto.createFromDao(learningPath));
    }

    public async getLearningPath(learningPathId: string) {
        const learningPath = await this.db.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
                recommendedUnitSequence: true,
            },
        });

        if (!learningPath) {
            throw new NotFoundException(`Can not find learningPath with id ${learningPathId}`);
        }

        return LearningPathDto.createFromDao(learningPath);
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
