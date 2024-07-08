import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import {
    CreateEmptyPathRequestDto,
    ErrorSynopsisDto,
    ErrorType,
    LearningPathDto,
    LearningPathListDto,
    UpdatePathRequestDto,
} from "./dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import {
    LearningUnit,
    Path,
    Skill,
    computeSuggestedSkills,
    findCycles,
    getPath,
    isLearningUnit,
    isSkill,
} from "../../nm-skill-lib/src";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { SkillDto } from "../skills/dto";

/**
 * Service that manages the creation/update/deletion of LearningPaths defined by teachers (courses).
 * @author El-Sharkawy
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
        const learningPath = await this.db.learningPath.create({
            data: {
                owner: dto.owner,
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
            },
        });

        return LearningPathDto.createFromDao(learningPath);
    }

    /**
     * Checks if a learningPath may be updated with the passed parameters and throws an error if not.
     * @param learningPathId The path to be checked (checks its lifecycle)
     * @param dto The data to be set
     * @returns Will return an exception if the update is not allowed, otherwise nothing will be returned.
     */
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
     * Creates an update query, but considers:
     * - null: The field shall be deleted (reset to default)
     * - undefined: The field shall not be changed
     * - value: The field shall be updated to the given value
     * @param ids The list of IDs that shall be updated (or undefined if no update shall be performed)
     * @returns The Prisma update query
     */
    private updateQuery(ids?: string[] | null) {
        if (ids === null) {
            return { set: [] };
        } else if (ids === undefined) {
            return undefined;
        } else {
            return { set: ids.map((item) => ({ id: item })) };
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
        // Check if path may be altered (based on its lifecycle)
        await this.precheckOfUpdateLearningPath(learningPathId, dto);

        // Delete on null -> []
        // No action on undefined -> undefined
        // Overwrite existing values on value -> value
        const recommendedUnits =
            dto.recommendedUnitSequence === null ? [] : dto.recommendedUnitSequence;

        let result = await this.db.learningPath.update({
            where: {
                id: learningPathId,
            },
            data: {
                owner: dto.owner,
                title: dto.title,
                description: dto.description,
                targetAudience: dto.targetAudience === null ? [] : dto.targetAudience,
                requirements: this.updateQuery(dto.requirements),
                pathTeachingGoals: this.updateQuery(dto.pathGoals),
                recommendedUnitSequence: recommendedUnits,
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
            },
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
                },
            });
        }

        return LearningPathDto.createFromDao(result);
    }

    /**
     * Part of `checkPath` to load a supt set of skills that are needed as all/goal/knowledge during path computation.
     * @param ids The IDs of the skills that shall be loaded (probably empty). `undefined` will load all skills.
     * @returns The loaded skills (probably empty)
     */
    private async loadSkills(ids?: string[]) {
        const skills = await this.db.skill.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: {
                nestedSkills: true,
            },
        });

        return skills.map((skill) => SkillDto.createFromDao(skill));
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
            const errors: ErrorSynopsisDto[] = cycles.map((cycle) => ({
                type: ErrorType.CYCLE_DETECTED,
                cause: `The given learning path contains cycles: ${cycle
                    .map((item) => item.id)
                    .join(" -> ")}`,
                affectedSkills: cycle.filter(isSkill).map((item) => item.id),
                affectedLearningUnits: cycle.filter(isLearningUnit).map((item) => item.id),
            }));
            throw new ConflictException(errors, `${cycles.length} cycles detected`);
        }

        // Check if there exist a path at all (full data set)
        const skills = await this.loadSkills();
        const goal = await this.loadSkills(path.pathGoals);
        const knowledge = await this.loadSkills(path.requirements);

        let computedPath: Path | null = null;
        if (path.recommendedUnitSequence.length > 0) {
            // For performance reasons, try compute path only on suggested units
            computedPath = await getPath({
                skills,
                goal,
                knowledge,
                learningUnits: units, //allUnits,
                optimalSolution: false,
            });
        }
        if (computedPath === null) {
            // Fall back try path with all available units
            const allUnits = await this.luFactory.getLearningUnits();
            computedPath = await getPath({
                skills,
                goal,
                knowledge,
                learningUnits: allUnits,
                optimalSolution: false,
            });
        }
        if (computedPath === null) {
            const from = knowledge.length > 0 ? knowledge.map((skill) => skill.id).join(", ") : "∅";
            const to = goal.length > 0 ? goal.map((skill) => skill.id).join(", ") : "∅";

            const errors: ErrorSynopsisDto[] = [
                {
                    type: ErrorType.PATH_NOT_FOUND,
                    cause: `Cannot compute a path from ${from} to ${to}`,
                    affectedSkills: [...knowledge, ...goal].map((skill) => skill.id),
                    affectedLearningUnits: [],
                },
            ];
            throw new ConflictException(errors, `Cannot compute a path from ${from} to ${to}`);
        }
    }

    /**
     * Re-validates an existing path (checks for cycles and completeness), without altering the path.
     * This is required to update the UI after an reload to enable a sve button only for valid paths.
     * @param learningPathId The ID of an existing learning path to be validated.
     */
    async validateStoredPath(learningPathId: string) {
        const learningPath = await this.db.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
            include: {
                requirements: true,
                pathTeachingGoals: true,
            },
        });

        if (!learningPath) {
            throw new NotFoundException(`Can not find learningPath with id ${learningPathId}`);
        }

        // Won't return anything if path is valid, but will return an exception if path is invalid
        await this.checkPath(LearningPathDto.createFromDao(learningPath));
    }

    async deleteLearningPath(learningPathId: string) {
        const oldLearningPath = await this.db.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
        });

        if (!oldLearningPath) {
            throw new NotFoundException(`LearningPath not found: ${learningPathId}`);
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

    public async loadLearningPathList(
        where?: Prisma.LearningPathWhereInput,
        page?: string,
        pageSize?: string,
    ) {
        const learningPathList = new LearningPathListDto();

        learningPathList.learningPaths = await this.loadLearningPaths(
            where,
            Number(page),
            Number(pageSize),
        );
        return learningPathList;
    }
    public async loadLearningPaths(
        where?: Prisma.LearningPathWhereInput,
        page?: number,
        pageSize?: number,
    ) {
        let skip;
        let take;
        if (page && pageSize) {
            if (page !== null && page >= 0 && pageSize !== null && pageSize > 0) {
                skip = (page - 1) * pageSize;
                take = pageSize;
            }
        }

        const learningPaths = await this.db.learningPath.findMany({
            where,
            include: {
                requirements: true,
                pathTeachingGoals: true,
            },
            skip, // Skip the specified number of items
            take, // Take the specified number of items
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
                // Generate the Update or Create query to
                // - For Create we need "connect" as there is no other command available
                // - For Update we need "set" to overwrite the old value
                function generateUpdateQuery(
                    cmd: keyof (Prisma.SkillUncheckedUpdateManyWithoutSuggestedByNestedInput &
                        Prisma.SkillUncheckedCreateNestedManyWithoutSuggestedByInput),
                ): Prisma.PreferredOrderingUncheckedUpdateWithoutLearningUnitInput &
                    Prisma.PreferredOrderingUncheckedCreateWithoutLearningUnitInput {
                    return {
                        orderId: preferredPathId,
                        suggestedSkills: {
                            [cmd]: missingSkills.map((skillId) => ({ id: skillId })),
                        },
                    };
                }

                if (missingSkills.length > 0) {
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
                                    create: generateUpdateQuery("connect"),
                                    update: generateUpdateQuery("set"),
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
