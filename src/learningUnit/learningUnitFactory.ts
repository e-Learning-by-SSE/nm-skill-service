import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitListDto,
} from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { LIFECYCLE, LearningUnit as PrismaLearningUnit, Prisma, Skill } from "@prisma/client";
import { SkillDto } from "../skills/dto";
import { LearningUnit } from "../../nm-skill-lib/src";
import { LearningUnitFilterDto } from "./dto/learningUnit-filter.dto";

/**
 * This factory is responsible for database-based operations on Learning Units. It is used to:
 * - Convert Self-Learning/Search specific DTOs into database operations (CRUD operations)
 * - Convert DAOs received from the data based to project-specific DTOs (including error handling)
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Carsten Wenzel <wenzelc@sse.uni-hildesheim.de>
 */
@Injectable()
export class LearningUnitFactory {
    public async patchLearningUnit(learningUnitId: string, dto: SearchLearningUnitCreationDto) {
        try {
            const existingLearningUnit = await this.loadLearningUnit(learningUnitId);

            if (!existingLearningUnit) {
                throw new NotFoundException(`Learning Unit not found: ${learningUnitId}`);
            }

            const updatedLearningUnit = await this.db.learningUnit.update({
                where: { id: "" + dto.id },
                data: {
                    id: "" + dto.id,
                    title: dto.title ?? "",
                    orga_id: dto.orga_id ?? "",
                    lifecycle: dto.lifecycle,
                    description: dto.description ?? "",
                    language: dto.language ?? "",

                    processingTime: dto.processingTime,
                    rating: dto.rating,
                    contentCreator: dto.contentCreator,
                    targetAudience: dto.targetAudience,
                    semanticDensity: dto.semanticDensity,
                    semanticGravity: dto.semanticGravity,
                    contentTags: dto.contentTags,
                    contextTags: dto.contextTags,
                    linkToHelpMaterial: dto.linkToHelpMaterial,

                    requirements: {
                        connect: dto.requiredSkills?.map((skillId) => ({ id: skillId })) ?? [],
                    },

                    teachingGoals: {
                        connect: dto.teachingGoals?.map((skillId) => ({ id: skillId })) ?? [],
                    },
                },
                include: {
                    requirements: true,

                    teachingGoals: true,
                },
            });
            return updatedLearningUnit;
        } catch (error) {
            throw error;
        }
    }
    constructor(private db: PrismaService) {}

    public async deleteLearningUnit(learningUnitId: string) {
        try {
            // Check if the Learning Unit exists before attempting to delete it
            const existingLearningUnit = await this.loadLearningUnit(learningUnitId);

            if (!existingLearningUnit) {
                throw new NotFoundException(`Learning Unit not found: ${learningUnitId}`);
            }
            if (existingLearningUnit.lifecycle != LIFECYCLE.DRAFT) {
                throw new ForbiddenException(
                    `Learning Unit : ${learningUnitId} is not in LIFECYCLE DRAFT State`,
                );
            }

            // Perform the deletion
            const deletedLearningUnit = await this.db.learningUnit.delete({
                where: { id: learningUnitId },
            });

            // Check if the deletion was successful
            if (!deletedLearningUnit) {
                throw new Error(`Failed to delete Learning Unit: ${learningUnitId}`);
            }

            // Return a success message or any other appropriate response
            return { message: `Learning Unit deleted successfully: ${learningUnitId}` };
        } catch (error) {
            // Handle specific errors or throw a custom exception if needed
            throw error;
        }
    }

    public async loadLearningUnit(learningUnitId: string): Promise<PrismaLearningUnit> {
        const learningUnit = await this.db.learningUnit.findUnique({
            where: { id: learningUnitId },
            include: {
                teachingGoals: true,
                requirements: true,
            },
        });

        if (!learningUnit) {
            throw new NotFoundException(`Specified LearningUnit not found: ${learningUnitId}`);
        }

        return learningUnit;
    }

    public async getLearningUnit(learningUnitId: string) {
        const dao = await this.loadLearningUnit(learningUnitId);

        return this.createLearningUnitDto(dao);
    }

    private async loadManyLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
        const learningUnits = await this.db.learningUnit.findMany({
            ...args,
            include: {
                teachingGoals: true,
                requirements: true,
            },
        });

        if (!learningUnits) {
            throw new NotFoundException(`Can not find any LearningUnits with parameters: ${args}`);
        }

        return learningUnits;
    }

    private createLearningUnitDto(
        dao: PrismaLearningUnit & {
            teachingGoals?: Skill[];
            requirements?: Skill[];
        },
    ) {
        const searchUnit = SearchLearningUnitDto.createFromDao(dao);
        searchUnit.requiredSkills = dao.requirements?.map((skill) => skill.id) ?? [];
        searchUnit.teachingGoals = dao.teachingGoals?.map((skill) => skill.id) ?? [];

        return searchUnit;
    }

    public async loadAllLearningUnits(args?: Prisma.LearningUnitFindManyArgs) {
        const learningUnits = await this.loadManyLearningUnits(args);
        const searchUnits = new SearchLearningUnitListDto();
        searchUnits.learningUnits = learningUnits.map(this.createLearningUnitDto);

        return searchUnits;
    }

    /**
   * Create a new Search-LearningUnit.
   * @param dto Specifies the learningUnit to be created
   * @returns The newly created learningUnit

   */
    private async createSearchLearningUnit(dto: SearchLearningUnitCreationDto) {
        // Create and return learningUnit
        try {
            const learningUnit = await this.db.learningUnit.create({
                data: {
                    id: dto.id,
                    title: dto.title ?? "",
                    orga_id: dto.orga_id ?? "",
                    lifecycle: dto.lifecycle,
                    description: dto.description ?? "",
                    language: dto.language ?? "",

                    processingTime: dto.processingTime,
                    rating: dto.rating,
                    contentCreator: dto.contentCreator,
                    targetAudience: dto.targetAudience,
                    semanticDensity: dto.semanticDensity,
                    semanticGravity: dto.semanticGravity,
                    contentTags: dto.contentTags,
                    contextTags: dto.contextTags,
                    linkToHelpMaterial: dto.linkToHelpMaterial,

                    requirements: {
                        connect: dto.requiredSkills?.map((skillId) => ({ id: skillId })) ?? [],
                    },

                    teachingGoals: {
                        connect: dto.teachingGoals?.map((skillId) => ({ id: skillId })) ?? [],
                    },
                },
                include: {
                    requirements: true,

                    teachingGoals: true,
                },
            });

            return this.createLearningUnitDto(learningUnit);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Learning Unit already exists");
                }
            }
            throw error;
        }
    }

    public async createLearningUnit(dto: SearchLearningUnitCreationDto) {
        return this.createSearchLearningUnit(dto);
    }

    /**
     * Returns LearningUnits in a format as required by the planning algorithms.
     * @param where Optional filter to select only specific LearningUnits.
     * @returns LearningUnits as required by the planning algorithms.
     *
     * @example
     * To select all LearningUnits that provide at least one of the given skills (as teaching goal), pass:
     * ```typescript
     * OR: {
     *     teachingGoals: {
     *         some: {
     *             id: {
     *                 in: skillIds,
     *             },
     *         },
     *     },
     * }
     * ```
     */
    async getLearningUnits(where?: Prisma.LearningUnitWhereInput): Promise<LearningUnit[]> {
        const learningUnits = await this.db.learningUnit.findMany({
            where,
            include: {
                requirements: {
                    include: {
                        nestedSkills: true,
                    },
                },
                teachingGoals: {
                    include: {
                        nestedSkills: true,
                    },
                },
                orderings: {
                    include: {
                        suggestedSkills: {
                            include: {
                                nestedSkills: true,
                            },
                        },
                    },
                },
            },
        });

        const results: LearningUnit[] = learningUnits.map((lu) => ({
            id: lu.id,
            requiredSkills: lu.requirements.map((skill) => SkillDto.createFromDao(skill)),
            teachingGoals: lu.teachingGoals.map((skill) => SkillDto.createFromDao(skill)),
            suggestedSkills: lu.orderings
                .flatMap((ordering) => ordering.suggestedSkills)
                // Avoid duplicates which would increase the weight of the skill
                .filter(
                    (skill, index, array) =>
                        index === array.findIndex((elem) => elem.id === skill.id),
                )
                .map((skill) => SkillDto.createFromDao(skill))
                .map((skill) => ({
                    weight: 0.1,
                    skill: skill,
                })),
        }));

        return results;
    }


    async getLearningUnitByFilter(filter: LearningUnitFilterDto): Promise<SearchLearningUnitListDto> {
        


        const query: Prisma.LearningUnitFindManyArgs = {};

        if (filter.requiredSkills && filter.requiredSkills.length > 0) {
            if (!Array.isArray(filter.requiredSkills)) {
                // If filter.owners is not an array, convert it to an array
                filter.owners = [filter.requiredSkills as string];
            }
            if (!query.where) {
                query.where = {};
            }
            query.where.requirements = {
                some: {
                    id: {
                        in: filter.requiredSkills,
                    },
                },
            };
        }

        if (filter.teachingGoals && filter.teachingGoals.length > 0) {
            if (!Array.isArray(filter.teachingGoals)) {
                // If filter.owners is not an array, convert it to an array
                filter.owners = [filter.teachingGoals as string];
            }
            if (!query.where) {
                query.where = {};
            }
            query.where.teachingGoals = {
                some: {
                    id: {
                        in: filter.teachingGoals,
                    },
                },
            };
        }

        if (filter.owners && filter.owners.length > 0) {
            if (!Array.isArray(filter.owners)) {
                // If filter.owners is not an array, convert it to an array
                filter.owners = [filter.owners as string];
            }
            if (!query.where) {
                query.where = {};
            }
            query.where.orga_id = {
                in: filter.owners,
            };
        }
        query.include = {
            teachingGoals: true,
            requirements: true,
        };
        const result = await this.db.learningUnit.findMany(query);

        const res :SearchLearningUnitListDto = new SearchLearningUnitListDto;
        result.forEach(element => {
            res.learningUnits.push (this.createLearningUnitDto(element))
        });


        return res;
      
      }
    

}
