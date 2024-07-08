import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import {
    SkillRepositoryListDto,
    SkillRepositoryDto,
    SkillRepositoryCreationDto,
    SkillRepositoryUpdateDto,
    UnresolvedSkillRepositoryDto,
} from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * Service that manages the creation/update/deletion of repositories.
 * @author Wenzel
 * @author El-Sharkawy
 */
@Injectable()
export class SkillRepositoryService {
    constructor(private db: PrismaService) {}

    /**
     * Creates a new skill repository for the specified user.
     * @param dto The data of the new repository.
     * @returns The created repository.
     */
    async createRepository(dto: SkillRepositoryCreationDto) {
        try {
            const repository = await this.db.skillMap.create({
                data: {
                    name: dto.name,
                    version: dto.version,
                    access_rights: dto.access_rights,
                    description: dto.description,
                    ownerId: dto.ownerId,
                },
            });

            return SkillRepositoryDto.createFromDao(repository);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException(
                        "Repository with specified name and version already owned",
                    );
                }
            }
            throw error;
        }
    }

    async deleteRepository(repositoryId: string) {
        const dao = await this.db.skillMap.findUnique({
            where: {
                id: repositoryId,
            },
            include: {
                skills: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!dao) {
            throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
        }
        const skillsInRepo = dao.skills.map((skill) => skill.id);

        // Use Promise.all to await all the queries for each skill
        await Promise.all(
            skillsInRepo.map(async (element) => {
                const skillsUsedInLearningUnits = await this.db.learningUnit.findMany({
                    where: {
                        OR: [
                            {
                                requirements: {
                                    some: {
                                        id: element,
                                    },
                                },
                            },
                            {
                                teachingGoals: {
                                    some: {
                                        id: element,
                                    },
                                },
                            },
                        ],
                    },
                    select: {
                        id: true,
                    },
                });

                if (skillsUsedInLearningUnits.length > 0) {
                    // If any skill is used in a learning unit, throw an error
                    throw new ForbiddenException(
                        `Specified repository with id: ${repositoryId} can not be deleted, some skills are part of a Learning Unit`,
                    );
                }
            }),
        );
        await this.db.skill.deleteMany({
            where: {
                id: {
                    in: skillsInRepo,
                },
            },
        });

        const deletedRepo = await this.db.skillMap.delete({
            where: {
                id: repositoryId,
            },
        });

        if (!deletedRepo) {
            throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
        }

        return deletedRepo;
    }

    async adaptRepository(repositoryId: string, dto: SkillRepositoryUpdateDto) {
        const dao = await this.db.skillMap
            .update({
                where: {
                    id: repositoryId,
                },
                data: {
                    ownerId: dto.owner,
                    access_rights: dto.access_rights,
                    description: dto.description,
                    name: dto.name,
                    taxonomy: dto.taxonomy,
                    version: dto.version,
                },
                include: { skills: true },
            })
            .catch((error) => {
                if (error instanceof PrismaClientKnownRequestError) {
                    // Specified Repository not found
                    if (error.code === "P2025") {
                        throw new NotFoundException(
                            `Specified repository not found: ${repositoryId}`,
                        );
                    }
                }
                throw error;
            });

        return UnresolvedSkillRepositoryDto.createDtoFromDao(dao);
    }

    /**
     * Loads a repository by ID with the specified parameters.
     * Allows most options, other functions are based on this one
     * @param owner Should only be specified if the repository is opened for writing.
     *              Specifying an owner will ensure that the repository is owned by the specified user and throw an error otherwise.
     * @param repositoryId The ID of the repository to be loaded
     * @param includeSkills Specifies if all skills of the repository shall be included in the result
     * @param args Additional arguments to be passed to the Prisma query
     * @returns The loaded repository or throws an error if the repository does not exist or the user is not the owner
     */
    public async getSkillRepository(
        owner: string | null,
        repositoryId: string,
        includeSkills = false,
        args?: Prisma.SkillMapFindUniqueArgs,
    ) {
        // Retrieve the repository, at which the skill shall be stored to
        const repository = await this.db.skillMap.findUnique({
            ...args,
            where: {
                id: repositoryId,
            },
            include: {
                skills: includeSkills,
            },
        });

        if (!repository) {
            throw new NotFoundException(`Specified repository not found: ${repositoryId}`);
        }

        if (owner && repository.ownerId !== owner) {
            throw new ForbiddenException(
                `Specified repository "${repositoryId}" is not owned by user: ${owner}`,
            );
        }
        return repository;
    }

    public async loadSkillRepository(repositoryId: string) {
        const repository = await this.getSkillRepository(null, repositoryId, true);
        return UnresolvedSkillRepositoryDto.createDtoFromDao(repository);
    }

    /**
     * Returns a list of all repositories owned by the specified user.
     * Won't include any information about nested skills.
     * @param ownerId The owner of the repositories
     * @returns The list of his repositories
     */
    async listSkillMaps(ownerId: string) {
        return this.findSkillRepositories(null, null, ownerId, null, null);
    }

    public async findSkillRepositories(
        page: number | null,
        pageSize: number | null,
        owner: string | null,
        name: string | Prisma.StringFilter | null,
        version: string | null,
    ) {
        const query: Prisma.SkillMapFindManyArgs = {};

        // By default all parameters of WHERE are combined with AND:
        // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#and
        if (owner || name || version) {
            query.where = {
                ownerId: owner ?? undefined,
                name: name ?? undefined,
                version: version ?? undefined,
            };
        } else {
            // Ensure pagination if no filters are defined
            if (page == null || pageSize == null) {
                page = page ?? 0;
                pageSize = pageSize ?? 10;
            }
        }
        if (page !== null && page >= 0 && pageSize !== null && pageSize > 0) {
            query.skip = page * pageSize;
            query.take = pageSize;
        }

        const repositories = await this.db.skillMap.findMany(query);

        const repoList = new SkillRepositoryListDto();
        repoList.repositories = repositories.map((repository) =>
            SkillRepositoryDto.createFromDao(repository),
        );

        return repoList;
    }
}
