import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SkillDto } from "../skills/dto";
import { PathDto, PathRequestDto, PathStorageRequestDto, PathStorageResponseDto, SkillsToAnalyze, SubPathDto, SubPathListDto  } from "./dto";
import { Skill, getPath, getSkillAnalysis } from "../../nm-skill-lib/src";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import {
    LearningHistory,
    LearningUnit,
    PersonalizedLearningPath,
    Skill as PrismaSkill,
    UserProfile,
} from "@prisma/client";

/**
 * Service for Graph requests
 * @author Wenzel
 * @author El-Sharkawy
 */
@Injectable()
export class PathFinderService {
    constructor(private db: PrismaService, private luFactory: LearningUnitFactory) {}

    // async getSkillsByRepository(repositoryId: string): Promise<Skill[]> {
    //     const skills = await this.db.skill.findMany({
    //         where: {
    //             repositoryId: repositoryId,
    //         },

    //         include: {
    //             nestedSkills: true,
    //         },
    //     });

    //     return skills.map((skill) => ({
    //         id: skill.id,
    //         repositoryId: skill.repositoryId,
    //         nestedSkills: skill.nestedSkills.map((skill) => skill.id),
    //     }));
    // }

    // public async getConnectedGraphForSkill(skillId: string, includeLearningUnits: boolean) {
    //     const daoSkillIn = await this.db.skill.findUnique({
    //         where: {
    //             id: skillId,
    //         },
    //         include: { nestedSkills: true },
    //     });

    //     if (!daoSkillIn) {
    //         throw new NotFoundException(`Specified skill not found: ${skillId}`);
    //     }

    //     const skills = await this.getSkillsByRepository(daoSkillIn.repositoryId);
    //     const learningUnits = await this.luFactory.getLearningUnits({
    //         teachingGoals: {
    //             some: {
    //                 id: {
    //                     in: skills.map((skill) => skill.id),
    //                 },
    //             },
    //         },
    //     });
    //     const graph = await getConnectedGraphForLearningUnit(learningUnits, skills);

    //     // TODO SE: Check what label is needed, e.g., title of learning units
    //     const nodeList: NodeDto[] = graph.nodes.map(
    //         (node) => new NodeDto(node.id, node.element.id),
    //     );
    //     const edgeList: EdgeDto[] = graph.edges.map((edge) => new EdgeDto(edge.from, edge.to));
    //     return new GraphDto(edgeList, nodeList);
    // }

    // public async findLuForRep(repId: string) {
    //     const learningUnits = await this.db.learningUnit.findMany({
    //         include: {
    //             teachingGoals: true,
    //         },
    //         where: {
    //             OR: {
    //                 requirements: {
    //                     some: {
    //                         repositoryId: repId,
    //                     },
    //                 },
    //                 teachingGoals: {
    //                     some: {
    //                         repositoryId: repId,
    //                     },
    //                 },
    //             },
    //         },
    //     });
    //     if (!learningUnits) {
    //         throw new NotFoundException(`Specified skill not found: ${repId}`);
    //     }

    //     return learningUnits;
    // }

    // public async isGraphForIdACycle(skillId: string) {
    //     const daoSkillIn = await this.db.skill.findUnique({
    //         where: {
    //             id: skillId,
    //         },
    //         include: { nestedSkills: true },
    //     });
    //     if (!daoSkillIn) {
    //         throw new NotFoundException(`Specified skill not found: ${skillId}`);
    //     }

    //     const skills = await this.getSkillsByRepository(daoSkillIn.repositoryId);
    //     const skillIds = [...new Set(skills.map((skill) => skill.id))];
    //     const allLUs = await this.luFactory.getLearningUnits({
    //         teachingGoals: {
    //             some: {
    //                 id: {
    //                     in: skillIds,
    //                 },
    //             },
    //         },
    //     });

    //     isAcyclic(skills, allLUs);

    //     return new CheckGraphDto(await isAcyclic(skills, allLUs));
    // }

    private async loadUser(userId: string) {
        const user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
                learningProfile: true,
                careerProfile: true,
                learningProgress: {
                    include: {
                        Skill: {
                            include: {
                                nestedSkills: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`Specified user not found: ${userId}`);
        }

        return user;
    }

    /**
     * Computes an (optimal) learning path to learn the specified goal (set of skills to be obtained).
     * Optionally, a specified user (learning behavior and progress to consider) can be specified.
     * This functions supports a greedy (fast) and an optimal (slow) algorithm.
     * @param dto Specifies the search parameters (goals to be learned, optional user profile, specification of greedy (default) or optimal algorithm)
     * @returns The computed path or a NotFoundException if no path could be computed for the specified goal
     */
    public async computePath(dto: PathRequestDto) {
        const goal = await this.loadSkills(dto.goal);

        // Find all skills that are in the same repository as the goals (most likely to find a solution for them)
        // Could be revised in future if algorithm detects relevant skills
        const repositories = [...new Set(goal.map((goal) => goal.repositoryId))];
        const skills = await this.loadAllSkillsOfRepositories(repositories);

        let knowledge: Skill[] | undefined;
        if (dto.userId) {
            const userProfile = await this.loadUser(dto.userId);
            const learnedSkills =
                userProfile.learningProgress.map((progress) => progress.Skill) ?? [];

            // DTO not required, but its constructor ensures that all required fields are handled
            // For instance: Repository, nested Skills, ...
            knowledge = learnedSkills.map((skill) => SkillDto.createFromDao(skill));

            // TODO SE:
            // 3. Develop cost function based on UserProfile
        }

        const path = await getPath({
            skills: skills,
            learningUnits: await this.luFactory.getLearningUnits(),
            goal,
            knowledge,
            optimalSolution: dto.optimalSolution,
        });

        if (!path) {
            throw new NotFoundException(
                `Could not compute a path for the specified goal: ${dto.goal}`,
            );
        }

        if (path.cost == -1) {
            throw new NotFoundException(
                `Could not compute a path for the specified goal: ${dto.goal}`,
                `Missing skills are : ${path.path[0].requiredSkills.map((lu) => lu.id)}`
            );
        }

        return new PathDto(
            path.path.map((lu) => lu.id),
            path.cost,
        );
    }

    /**
     * @param dto Specifies the search parameters (goals to be analyzed)
     * @returns A list of the missing skills with the sub paths for them
     */
    public async skillAnalysis(dto: SkillsToAnalyze) {
        const goal = await this.loadSkills(dto.goal);

        // Find all skills that are in the same repository as the goals (most likely to find a solution for them)
        // Could be revised in future if algorithm detects relevant skills
        const repositories = [...new Set(goal.map((goal) => goal.repositoryId))];
        const skills = await this.loadAllSkillsOfRepositories(repositories);

        const skillAnalyzedPath = await getSkillAnalysis({
            skills: skills,
            learningUnits: await this.luFactory.getLearningUnits(),
            goal
        });

        if (!skillAnalyzedPath) {
            throw new NotFoundException(
                `There is a learning path for the goal: ${dto.goal}, try to use computePath`,
            );
        }

        const subPathDtoList = new SubPathListDto();
        skillAnalyzedPath.forEach(analyzedPath => {
            const subPath = new SubPathDto(
                analyzedPath.missingSkill,
                analyzedPath.subPath.path.map((lu) => lu.id),
            );
            subPathDtoList.subPaths.push(subPath);
        });

        return subPathDtoList;
    }
    
    private async loadSkills(skillIds: string[]) {
        const skillDAOs = await this.db.skill.findMany({
            where: {
                id: {
                    in: skillIds,
                },
            },
            include: {
                nestedSkills: true,
            },
        });

        if (!skillDAOs) {
            throw new NotFoundException(`Specified skills not found: ${skillIds}`);
        } else if (skillDAOs.length < skillIds.length) {
            const missedIds = skillIds.filter((id) => !skillDAOs.map((dao) => dao.id).includes(id));
            throw new NotFoundException(`Not all specified skills could be found: ${missedIds}`);
        }

        return skillDAOs.map((skill) => ({
            id: skill.id,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((skill) => skill.id),
        }));
    }

    private async loadAllSkillsOfRepositories(repositories: string[]) {
        const skillDAOs = await this.db.skill.findMany({
            where: {
                repositoryId: {
                    in: repositories,
                },
            },
            include: {
                nestedSkills: true,
            },
        });

        if (!skillDAOs) {
            throw new NotFoundException(
                `Could not find any skill for the specified repositories: ${repositories}`,
            );
        }

        return skillDAOs.map((skill) => ({
            id: skill.id,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((skill) => skill.id),
        }));
    }

    private async createOrLoadLearningHistory(userId: string) {
        // Ensure that a user profile exists
        let user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            user = await this.db.userProfile.create({
                data: {
                    id: userId,
                    status: "ACTIVE",
                },
            });
        }

        // Create learning history
        let learningHistory = await this.db.learningHistory.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!learningHistory) {
            learningHistory = await this.db.learningHistory.create({
                data: {
                    userId: userId,
                },
            });
        }

        return learningHistory;
    }

    public async storePersonalizedPath(userId: string, dto: PathStorageRequestDto) {
        let goals: string[] = [];

        // Load Learning History
        const learningHistory = await this.createOrLoadLearningHistory(userId);

        // Load the source of the path (either a pre-defined path or a goal)
        if (dto.originPathId) {
            const path = await this.db.learningPath.findUnique({
                where: {
                    id: dto.originPathId,
                },
                include: {
                    pathTeachingGoals: true,
                },
            });
            if (!path) {
                throw new NotFoundException(`Specified path not found: ${dto.originPathId}`);
            }
            goals = path.pathTeachingGoals.map((goal) => goal.id);
        } else if (dto.goal) {
            goals = dto.goal;
        } else {
            throw new ConflictException(`Either originPathId or goal must be specified: ${dto}`);
        }

        // Create the personalized path
        let newPath: PersonalizedLearningPath & {
            unitSequence: LearningUnit[];
            pathTeachingGoals: PrismaSkill[];
            userProfile: LearningHistory & { user: UserProfile };
        };
        try {
            newPath = await this.db.personalizedLearningPath.create({
                data: {
                    userProfileId: learningHistory.id,
                    learningPathId: dto.originPathId,
                    pathTeachingGoals: {
                        connect: goals.map((goal) => ({ id: goal })),
                    },
                    unitSequence: {
                        connect: dto.units.map((unit) => ({ id: unit })),
                    },
                    lifecycle: "CREATED",
                },
                include: {
                    unitSequence: true,
                    pathTeachingGoals: true,
                    userProfile: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }

        if (!newPath) {
            throw new NotFoundException(`Could not store path: ${dto}`);
        }

        // Create ordered path to track progress
        for (let i = 0; i < dto.units.length; i++) {
            this.db.learningPathProgress.create({
                data: {
                    personalPathId: newPath.id,
                    unitId: dto.units[i],
                },
            });
        }

        return PathStorageResponseDto.createFromDao(newPath);
    }
}
