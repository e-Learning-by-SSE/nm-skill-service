import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import {
    CreateEmptyPathRequestDto,
    LearningPathDto,
    LearningPathListDto,
    UpdatePathRequestDto,
} from "./dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import {
    LearningUnit,
    Skill,
    computeSuggestedSkills,
    findCycles,
    getPath,
} from "../../nm-skill-lib/src";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { SkillDto } from "../skills/dto";

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

    async precheckOfUpdateLearningPath(learningPathId: string, dto: UpdatePathRequestDto) {
        const oldLearningPath = await this.db.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
        });

        if (!oldLearningPath) {
            throw new NotFoundException(`Can not find learningPath with id ${learningPathId}`);
        }

        // If in DRAFT mode, all changes are allowed
        if (oldLearningPath.lifecycle === "DRAFT") {
            return;
        }

        // If in POOLED mode, only description may be altered and the lifecycle may be changed to ARCHIVED
        if (oldLearningPath.lifecycle === "POOL") {
            // Check if any other values than description and lifecycle are defined in the dto
            const dtoKeys = Object.keys(dto);
            if (dtoKeys.includes("description")) {
                dtoKeys.splice(dtoKeys.indexOf("description"), 1);
            }
            if (dto["lifecycle"] === "ARCHIVED") {
                dtoKeys.splice(dtoKeys.indexOf("lifecycle"), 1);
            }

            if (dtoKeys.length > 0) {
                const forbiddenProperties = dtoKeys.join(", ");
                throw new ForbiddenException(
                    `Tried to alter write-protected properties of POOLED path: ${forbiddenProperties}`,
                );
            }
        }

        // If in ARCHIVED mode, no changes are allowed
        if (oldLearningPath.lifecycle === "ARCHIVED") {
            throw new ForbiddenException("Archived Learning-Paths may not be altered");
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
    async updateLearningPath(learningPathId: string, dto: UpdatePathRequestDto, checkPath = true) {
        await this.precheckOfUpdateLearningPath(learningPathId, dto);

        const requirements =
            dto.requirements === null ? [] : dto.requirements?.map((req) => ({ id: req }));
        const pathTeachingGoals =
            dto.pathGoals === null ? [] : dto.pathGoals?.map((goal) => ({ id: goal }));
        const unitOrder =
            dto.recommendedUnitSequence === null
                ? []
                : dto.recommendedUnitSequence?.map((unit) => ({ id: unit }));

        let result = await this.db.learningPath
            .update({
                where: {
                    id: learningPathId,
                },
                data: {
                    owner: dto.owner,
                    title: dto.title,
                    description: dto.description,
                    targetAudience: dto.targetAudience,
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
            })
            .catch((error) => {
                if (error instanceof PrismaClientKnownRequestError) {
                    // Specified Learning not found
                    if (error.code === "P2025") {
                        throw new NotFoundException(
                            `LearningPath with id ${learningPathId} not found`,
                        );
                    }
                }
                throw error;
            });

        if (dto.recommendedUnitSequence) {
            // Define / Update preferred path
            await this.definePreferredPath(dto.recommendedUnitSequence, learningPathId);
        } else if (dto.recommendedUnitSequence === null) {
            // Delete preferred path
            await this.db.preferredOrdering.deleteMany({
                where: {
                    orderId: learningPathId,
                },
            });
        }

        if (checkPath) {
            // Will throw an error and abort if path contains cycles or is incomplete
            await this.checkPath(LearningPathDto.createFromDao(result));
        }

        // Alter lifecycle only if no errors were detected
        if (dto.lifecycle) {
            result = await this.db.learningPath.update({
                where: {
                    id: learningPathId,
                },
                data: {
                    lifecycle: dto.lifecycle,
                },
                include: {
                    requirements: true,
                    pathTeachingGoals: true,
                    recommendedUnitSequence: true,
                },
            });
        }

        return LearningPathDto.createFromDao(result);
    }

    private async checkPath(path: LearningPathDto) {
        // Check for cycles on minimal dataset to avoid incomprehensible error messages
        const units = await this.luFactory.getLearningUnits({
            id: {
                in: path.recommendedUnitSequence,
            },
        });
        const usedSkills = new Set<Skill>();
        units.forEach((unit) => {
            unit.teachingGoals.forEach((goal) => {
                usedSkills.add(goal);
            });
            unit.requiredSkills.forEach((requirement) => {
                usedSkills.add(requirement);
            });
            unit.suggestedSkills
                .map((suggestion) => suggestion.skill)
                .forEach((skill) => {
                    usedSkills.add(skill);
                });
        });

        const cycles = findCycles(Array.from(usedSkills), units);
        if (cycles.length > 0) {
            throw new ConflictException(
                `The given learning path contains cycles: ${cycles
                    .map((cycle) => cycle.map((skill) => skill.id).join(" -> "))
                    .join(", ")}`,
            );
        }

        // Check if there exist a path at all (full data set)
        const allUnits = await this.luFactory.getLearningUnits();
        const skills = (
            await this.db.skill.findMany({
                include: {
                    nestedSkills: true,
                },
            })
        ).map((skill) => SkillDto.createFromDao(skill));
        const goalSkills = await this.db.skill.findMany({
            where: {
                id: {
                    in: path.pathGoals,
                },
            },
            include: {
                nestedSkills: true,
            },
        });
        const goal = goalSkills.map((skill) => ({
            id: skill.id,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((skill) => skill.id),
        }));
        const knownSkills = await this.db.skill.findMany({
            where: {
                id: {
                    in: path.requirements,
                },
            },
            include: {
                nestedSkills: true,
            },
        });
        const knowledge = knownSkills.map((skill) => ({
            id: skill.id,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((skill) => skill.id),
        }));
        const computedPath = await getPath({
            skills,
            goal,
            knowledge,
            learningUnits: allUnits,
            optimalSolution: false,
        });
        if (computedPath === null) {
            const from = knowledge.length > 0 ? knowledge.map((skill) => skill.id).join(", ") : "∅";
            const to = goal.length > 0 ? goal.map((skill) => skill.id).join(", ") : "∅";

            throw new ConflictException(`Cannot compute a path from ${from} to ${to}`);
        }
    }

    async deleteLearningPath(learningPathId: string) {
        const oldLearningPath = await this.db.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
        });

        if (!oldLearningPath) {
            throw new NotFoundException(`Can not find learningPath with id ${learningPathId}`);
        }

        if (oldLearningPath.lifecycle !== "DRAFT") {
            throw new ForbiddenException(
                `Only drafted LearningPaths may be deleted, but this is ${oldLearningPath.lifecycle}`,
            );
        }

        // Perform deletion
        await this.db.learningPath.delete({
            where: {
                id: learningPathId,
            },
        });
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
    public async definePreferredPath(recommendedUnitSequence: string[], preferredPathId: string) {
        const learningUnits = await this.luFactory.getLearningUnits({
            id: {
                in: recommendedUnitSequence,
            },
        });

        if (!learningUnits) {
            throw new NotFoundException("Can not find any learningUnits");
        } else if (learningUnits.length !== recommendedUnitSequence.length) {
            const missingIds = recommendedUnitSequence.filter(
                (requestedId) =>
                    !learningUnits.some((learningUnit) => learningUnit.id === requestedId),
            );
            throw new NotFoundException(`Can not find all LearningUnits. Missing: ${missingIds}`);
        }

        // Order learningUnits by the given ID list
        learningUnits.sort((a, b) => {
            return recommendedUnitSequence.indexOf(a.id) - recommendedUnitSequence.indexOf(b.id);
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
