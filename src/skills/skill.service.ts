import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Prisma, Skill } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../prisma/prisma.service";
import {
    SkillCreationDto,
    ResolvedSkillDto,
    SkillListDto,
    SkillDto,
    ResolvedSkillListDto,
} from "./dto";
import { SkillUpdateDto } from "./dto/skill-update.dto";
import { SkillRepositoryService } from "./skill-repository.service";
import { findCycles } from "../../nm-skill-lib/src";

/**
 * Used multiple times to include nestedSkills and parentSkills and
 * order them by their creation date to enforce a consistent order.
 */
const INCLUDE_CHILDREN_AND_PARENTS: Prisma.SkillInclude = {
    nestedSkills: {
        select: {
            id: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    },
    parentSkills: {
        select: {
            id: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    },
};

/**
 * Service that manages the creation/update/deletion of skills.
 * @author Wenzel
 * @author El-Sharkawy
 */
@Injectable()
export class SkillMgmtService {
    constructor(private db: PrismaService, private repositoryService: SkillRepositoryService) {}

    /**
     * Retrieve all skills from the database, including their nestedSkills and parentSkills,
     * and map them to SkillDto objects while maintaining the skill hierarchy.
     * @returns {SkillListDto} A SkillListDto containing the complete list of skills.
     * @throws {NotFoundException} If no skills are found in the database.
     */
    async loadAllSkills() {
        // Retrieve skills from the database, including nestedSkills and parentSkills

        const skills = await this.db.skill.findMany({
            include: INCLUDE_CHILDREN_AND_PARENTS,
        });
        // Check if no skills were found, and throw an exception if so
        if (skills.length == 0) {
            throw new NotFoundException("Can not find any skills");
        }
        // Create a SkillListDto instance to store the list of skills
        const skillList = new SkillListDto();

        // Map the retrieved skills to SkillDto objects and include nestedSkills and parentSkills

        skillList.skills = skills.map((skill) => SkillDto.createFromDao(skill));

        // Return the skillList containing the skills hierarchy
        return skillList;
    }

    async checkIfSkillUsedInLearningUnits(skillId: string) {
        const learningUnitsWithSkill = await this.db.learningUnit.findMany({
            where: {
                OR: [
                    {
                        requirements: {
                            some: {
                                id: skillId,
                            },
                        },
                    },
                    {
                        teachingGoals: {
                            some: {
                                id: skillId,
                            },
                        },
                    },
                ],
            },
        });

        return learningUnitsWithSkill.length > 0;
    }

    /**
     * Adds a new skill to a specified repository
     * @param dto Specifies the skill to be created and the repository at which it shall be created
     * @returns The newly created skill
     */
    async createSkill(skillRepositoryId: string, dto: SkillCreationDto) {
        // Checks that the user is the owner of the repository / repository exists
        await this.repositoryService.getSkillRepository(dto.owner, skillRepositoryId);

        // Create and return skill
        try {
            const nestedSkills = dto.nestedSkills || [];
            const skill = await this.db.skill.create({
                data: {
                    repositoryId: skillRepositoryId,
                    name: dto.name,
                    level: dto.level,
                    description: dto.description,
                    nestedSkills: {
                        connect: nestedSkills.map((nestedSkillId) => ({ id: nestedSkillId })),
                    },
                },
                include: INCLUDE_CHILDREN_AND_PARENTS,
            });
            return SkillDto.createFromDao(skill);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Skill already exists in specified repository");
                }
            }
            throw error;
        }
    }

    private async loadNestedSkill(
        skill: Skill & {
            nestedSkills: Skill[];
        },
        resolved = new Map<string, ResolvedSkillDto>(),
    ) {
        const result = ResolvedSkillDto.createFromDao(skill);
        resolved.set(skill.id, result);

        // Add nested skills
        for (const child of skill.nestedSkills) {
            // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
            result.nestedSkills.push(await this.getNestedSkill(child.id, resolved));
        }

        return result;
    }

    public async getSkill(skillId: string) {
        const dao = await this.db.skill.findUnique({
            where: {
                id: skillId,
            },
            include: INCLUDE_CHILDREN_AND_PARENTS,
        });

        if (!dao) {
            throw new NotFoundException(`Specified skill not found: ${skillId}`);
        }

        const skill = SkillDto.createFromDao(dao);
        skill.nestedSkills = dao.nestedSkills.map((c) => c.id);
        skill.parentSkills = dao.parentSkills.map((sk) => sk.id);
        return skill;
    }

    public async getResolvedSkill(skillId: string) {
        const dao = await this.db.skill.findUnique({
            where: {
                id: skillId,
            },
            include: {
                nestedSkills: true,
                parentSkills: true,
            },
        });

        if (!dao) {
            throw new NotFoundException(`Specified skill not found: ${skillId}`);
        }

        return this.loadNestedSkill(dao);
    }
    public async deleteSkillWithoutCheck(skillId: string) {
        const dao = await this.db.skill.delete({
            where: {
                id: skillId,
            },
        });

        if (!dao) {
            throw new NotFoundException(`Specified skill not found: ${skillId}`);
        }

        return dao;
    }
    /**
     * Recursive function to resolve nested sills.
     *
     * **Warning:** This won't prevent for endless loops if skill tree is not acyclic!
     * @param skillId The ID of the skill to be resolved
     * @param resolved A map of already resolved skills, to prevent duplicate resolving
     * @returns The resolved skill
     */
    public async getNestedSkill(skillId: string, resolved: Map<string, ResolvedSkillDto>) {
        const resolvedSkill = resolved.get(skillId);
        let result: ResolvedSkillDto;

        if (resolvedSkill) {
            result = resolvedSkill;
        } else {
            const dao = await this.db.skill.findUnique({
                where: {
                    id: skillId,
                },
                include: {
                    nestedSkills: true,
                },
            });

            // Unsure if we need this: Due to foreign key constraints, this should not be possible
            if (!dao) {
                throw new NotFoundException(`Specified skill not found: ${skillId}`);
            }

            const dto = ResolvedSkillDto.createFromDao(dao);
            resolved.set(dao.id, dto);
            // Add nested skills
            for (const child of dao.nestedSkills) {
                // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
                dto.nestedSkills.push(await this.getNestedSkill(child.id, resolved));
            }

            result = dto;
        }

        return result;
    }

    public async searchSkills(
        page: number | null,
        pageSize: number | null,
        name: string | Prisma.StringFilter | null,
        level: number | null,
        repositoryId: string | null,
    ) {
        const query: Prisma.SkillFindManyArgs = {};

        // By default all parameters of WHERE are combined with AND:
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
        if (name || repositoryId) {
            query.where = {
                name: name ?? undefined,
                repositoryId: repositoryId ?? undefined,
            };
            // Consider level only if at least also a name was specified
            if (name) {
                query.where.level = level ?? undefined;
            }
        } else {
            // Ensure pagination if no filters are defined
            if (page == null || pageSize == null) {
                page = page ?? 0;
                pageSize = pageSize ?? 10;
            }
        }
        if (page && page >= 0 && pageSize && pageSize > 0) {
            query.skip = page * pageSize;
            query.take = pageSize;
        }
        const skills = await this.db.skill.findMany({
            ...query,
            include: {
                nestedSkills: {
                    select: {
                        id: true,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        if (!skills) {
            throw new NotFoundException("Can not find any skills");
        }

        // Resolve nested skills if there are any
        const skillList = new SkillListDto();
        for (const skill of skills) {
            const child = SkillDto.createFromDao(skill);
            // Add nested skills
            child.nestedSkills = skill.nestedSkills.map((c) => c.id);

            skillList.skills.push(child);
        }

        return skillList;
    }

    public async searchSkillsResolved(
        page: number | null,
        pageSize: number | null,
        name: string | Prisma.StringFilter | null,
        level: number | null,
        repositoryId: string | null,
    ) {
        const query: Prisma.SkillFindManyArgs = {};

        // By default all parameters of WHERE are combined with AND:
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
        if (name || repositoryId) {
            query.where = {
                name: name ?? undefined,
                repositoryId: repositoryId ?? undefined,
            };
            // Consider level only if at least also a name was specified
            if (name) {
                query.where.level = level ?? undefined;
            }
        } else {
            // Ensure pagination if no filters are defined
            if (page == null || pageSize == null) {
                page = page ?? 0;
                pageSize = pageSize ?? 10;
            }
        }
        if (page && page >= 0 && pageSize && pageSize > 0) {
            query.skip = page * pageSize;
            query.take = pageSize;
        }
        const skills = await this.db.skill.findMany({
            ...query,
            include: {
                nestedSkills: true,
            },
        });

        if (!skills) {
            throw new NotFoundException("Can not find any skills");
        }

        // Resolve nested skills if there are any
        const skillList = new ResolvedSkillListDto();
        const resolved = new Map<string, ResolvedSkillDto>();
        for (const skill of skills) {
            // Promise.all would be much faster, but this would not guarantee reuse of already resolved objects
            skillList.skills.push(await this.loadNestedSkill(skill, resolved));
        }

        return skillList;
    }

    async deleteSkillWithCheck(skillId: string): Promise<void> {
        // Check if the skill is already in use

        const isUsed = await this.isSkillUsed([skillId]);
        if (isUsed) {
            throw new BadRequestException("Skill is already used and cannot be deleted.");
        }

        // Retrieve all children of this skill
        const childSkills = await this.getChildSkills(skillId);
        let childIsUsed = false;
        // Check if any Child is used i a Learning Unit
        for (const childSkill of childSkills) {
            if (await this.isSkillUsed([childSkill.id])) {
                childIsUsed = true;
            }
        }
        if (childIsUsed) {
            throw new BadRequestException("Child of Skill is already used and cannot be deleted.");
        }
        // Recursively delete children
        for (const childSkill of childSkills) {
            await this.deleteSkillRecursive(childSkill.id);
        }

        // Delete the current skill
        await this.db.skill.delete({
            where: { id: skillId },
        });
    }

    public async isSkillUsed(skillId: string[]): Promise<boolean> {
        // Check if the skill is used in learning units
        const learningUnits = await this.db.learningUnit.findMany({
            where: {
                OR: [
                    { requirements: { some: { id: { in: skillId } } } },
                    { teachingGoals: { some: { id: { in: skillId } } } },
                ],
            },
        });
        return learningUnits.length > 0;
    }

    public async getChildSkills(parentSkillId: string): Promise<Skill[]> {
        // Query to retrieve children of the skill
        return await this.db.skill.findMany({
            where: { parentSkills: { some: { id: parentSkillId } } },
        });
    }

    public async deleteSkillRecursive(skillId: string): Promise<void> {
        const childSkills = await this.getChildSkills(skillId);

        for (const childSkill of childSkills) {
            await this.deleteSkillRecursive(childSkill.id);
        }

        await this.db.skill.delete({
            where: { id: skillId },
        });
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

    async updateSkill(skillId: string, dto: SkillUpdateDto) {
        // Auxillary function that checks deleted/added parents/nested skills if they are used
        const updatedRelationIsInUse = async (
            skillsOfDto: string[],
            previousSkills: Skill[],
            type: "nested" | "parent",
        ) => {
            const oldNestedSkills = previousSkills.map((skill) => skill.id);
            const addedSkills = skillsOfDto.filter((id) => !oldNestedSkills.includes(id));
            let isNestedUsed = await this.isSkillUsed(addedSkills);
            if (isNestedUsed) {
                throw new ForbiddenException(
                    `At least one ${type} skill which shall be added is already used and cannot be modified: ${addedSkills.join(
                        ", ",
                    )}`,
                );
            }
            const deletedSkills = oldNestedSkills.filter((id) => !skillsOfDto.includes(id));
            isNestedUsed = await this.isSkillUsed(deletedSkills);
            if (isNestedUsed) {
                throw new ForbiddenException(
                    `At least one ${type} skill which shall be removed is already used and cannot be modified: ${deletedSkills.join(
                        ", ",
                    )}`,
                );
            }
        };

        // Update the skill with the provided data as transaction
        const updatedSkill = await this.db.$transaction(async (tx) => {
            // Check if the skill is already in use
            const isUsed = await this.isSkillUsed([skillId]);
            if (isUsed) {
                throw new ForbiddenException("Skill is already used and cannot be modified.");
            }

            if (dto.nestedSkills || dto.parentSkills) {
                // To check nested/parent skills to be removed and load data only once and only if needed
                const previousState = await tx.skill.findUnique({
                    where: { id: skillId },
                    include: {
                        nestedSkills: true,
                        parentSkills: true,
                    },
                });

                if (!previousState) {
                    throw new NotFoundException(`Skill with ID ${skillId} not found`);
                }

                // Check if the nested skills to be changed are already used
                if (dto.nestedSkills) {
                    await updatedRelationIsInUse(
                        dto.nestedSkills,
                        previousState.nestedSkills,
                        "nested",
                    );
                }

                // Check if the parent skills to be changed are already used
                if (dto.parentSkills) {
                    await updatedRelationIsInUse(
                        dto.parentSkills,
                        previousState.parentSkills,
                        "parent",
                    );
                }
            }

            // Apply update
            const updatedSkill = await tx.skill.update({
                where: { id: skillId },
                data: {
                    name: dto.name,
                    level: dto.level,
                    description: dto.description,
                    nestedSkills: this.updateQuery(dto.nestedSkills),
                    parentSkills: this.updateQuery(dto.parentSkills),
                },
                include: {
                    ...INCLUDE_CHILDREN_AND_PARENTS,
                    pathTeachingGoals: true,
                },
            });

            // Check if the update would create a cyclic relationship between skills
            const allSkills = await tx.skill.findMany({
                where: {
                    repositoryId: updatedSkill.repositoryId,
                },
                include: {
                    nestedSkills: true,
                    parentSkills: true,
                },
            });
            const allSkillDtos = allSkills.map((skill) => SkillDto.createFromDao(skill));
            const errors = findCycles(allSkillDtos);

            if (errors.length > 0) {
                // Rollback transaction and throw an exception
                throw new ForbiddenException(
                    "The update would create a cyclic relationship between skills.",
                );
            }

            // Return the updated skill and close transaction if no error occurred
            return updatedSkill;
        });

        if (dto.repositoryId && dto.repositoryId !== updatedSkill.repositoryId) {
            return await this.moveSkillToRepository(skillId, dto.repositoryId);
        }

        return SkillDto.createFromDao(updatedSkill);
    }

    /**
     * Moves a skill and all of its children to a new repository.
     * @param skillId The ID of the skill to move
     * @param newRepositoryId The ID of the repository to move the skill to
     * @returns The list of moved skills
     * @throws {NotFoundException} If the specified skill does not exist
     * @throws {ForbiddenException} If the skill or any of its children is already used or has an additional parent
     */
    public async moveSkillToRepository(skillId: string, newRepositoryId: string) {
        /**
         * Apply multiple operations as a single transaction:
         * https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
         */
        const movedSkills = await this.db.$transaction(async (tx) => {
            /*
             * Identify the current repository of the skill and load all skills of this repository
             * to check if skill and its children can be moved
             */
            const skill = await tx.skill.findUnique({
                where: { id: skillId },
                include: {
                    nestedSkills: true,
                    parentSkills: true,
                },
            });

            if (!skill) {
                throw new NotFoundException(`Skill with ID ${skillId} not found`);
            }

            // Load all skills of the same repository
            const skillsOfRepository = new Map<
                string,
                Skill & {
                    nestedSkills: Skill[];
                    parentSkills: Skill[];
                }
            >();
            (
                await tx.skill.findMany({
                    where: { repositoryId: skill.repositoryId },
                    include: {
                        nestedSkills: true,
                        parentSkills: true,
                    },
                })
            ).forEach((s) => skillsOfRepository.set(s.id, s));

            // Identify all children of the skill
            const childSkills = new Map<
                string,
                Skill & {
                    nestedSkills: Skill[];
                    parentSkills: Skill[];
                }
            >();
            const queue = [skill];
            while (queue.length > 0) {
                const currentSkill = queue.pop();
                if (currentSkill) {
                    childSkills.set(currentSkill.id, currentSkill);
                    currentSkill.nestedSkills.forEach((child) => {
                        const nestedSkill = skillsOfRepository.get(child.id);
                        if (nestedSkill) {
                            queue.push(nestedSkill);
                        }
                    });
                }
            }

            /*
             * Sanity check 1: The skill to move is top-level and none of the children
             * has an additional parent outside of the determined structure
             */
            const childrenWithFurtherParents: string[] = [];
            for (const child of childSkills.values()) {
                if (child.parentSkills.some((parent) => !childSkills.has(parent.id))) {
                    childrenWithFurtherParents.push(child.id);
                }
            }
            if (childrenWithFurtherParents.length > 0) {
                throw new ForbiddenException(
                    `Skills ${childrenWithFurtherParents.join(
                        ", ",
                    )} are nested below a Skill which shall not be moved.`,
                );
            }

            // Sanity check 2: None of the skills should be used by a learning unit
            const skillsInUse: string[] = [];
            for (const child of childSkills.values()) {
                if (await this.isSkillUsed([child.id])) {
                    skillsInUse.push(child.id);
                }
            }
            if (skillsInUse.length > 0) {
                throw new ForbiddenException(
                    `Skills ${skillsInUse.join(", ")} are already used and cannot be moved.`,
                );
            }

            // Move the skill and its children to the new repository
            await tx.skill.updateMany({
                where: {
                    id: {
                        in: [...childSkills.keys()],
                    },
                },
                data: { repositoryId: newRepositoryId },
            });

            // Return the moved skills
            return await tx.skill.findMany({
                where: {
                    id: {
                        in: [...childSkills.keys()],
                    },
                },
                include: INCLUDE_CHILDREN_AND_PARENTS,
            });
        });

        const skillList = new SkillListDto();
        skillList.skills = movedSkills.map((skill) => SkillDto.createFromDao(skill));
        return skillList;
    }
}
