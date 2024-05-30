import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SkillDto } from "../skills/dto";
import {
    CustomCoursePreviewResponseDto,
    EnrollmentPreviewResponseDto,
    PathDto,
    PathRequestDto,
    PathStorageRequestDto,
    PathStorageResponseDto,
    SkillsToAnalyze,
    SubPathDto,
    SubPathListDto,
} from "./dto";
import { Skill, getPath, getSkillAnalysis } from "../../nm-skill-lib/src";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";

/**
 * Service for Graph requests
 * @author Wenzel
 * @author El-Sharkawy
 */
@Injectable()
export class PathFinderService {
    constructor(
        private db: PrismaService,
        private luFactory: LearningUnitFactory,
        private historyService: LearningHistoryService,
    ) {}

    private async loadUser(userId: string) {
        const user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
            include: {
                learningProfile: true,
                careerProfile: true,
                learningHistory: {
                    include: {
                        learnedSkills: {
                            include: {
                                Skill: {
                                    include: {
                                        nestedSkills: true,
                                    },
                                },
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

        // TODO: Revise

        let knowledge: Skill[] | undefined;
        if (dto.userId) {
            // Consider already learned Skills of the user
            const userProfile = await this.loadUser(dto.userId);
            const learnedSkills =
                userProfile.learningHistory?.learnedSkills.map((progress) => progress.Skill) ?? [];

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
                `Missing skills are : ${path.path[0].requiredSkills.map((lu) => lu.id)}`,
            );
        }

        return new PathDto(
            path.path.map((lu) => lu.id),
            path.cost,
        );
    }

    /**
     * For a specified pre-defined path, the path is personalized to the given user and returns the result.
     * @param userId The user for whom the course should be personalized to
     * @param pathId The pre-defined path that should be personalized
     * @param storePath if true, the path will be stored in the user's learning history otherwise only the path will be returned as a preview
     * @param optimalSolution If true, the algorithm will try to find an optimal path, at cost of performance.
     * @returns Either the stored personalized path (storePath = true) or a preview of the path (storePath = false)
     */
    public async enrollment(
        userId: string,
        pathId: string,
        storePath: boolean = true,
        optimalSolution: boolean = false,
    ) {
        // Load pre-defined path (defined by content creators)
        const pathDefinition = await this.db.learningPath.findUnique({
            where: {
                id: pathId,
            },
            include: {
                pathTeachingGoals: true,
            },
        });

        if (!pathDefinition) {
            throw new NotFoundException(`Specified path not found: ${pathId}`);
        }

        // Compute path for the user
        const path = await this.computePath({
            goal: pathDefinition.pathTeachingGoals.map((goal) => goal.id),
            userId: userId,
            optimalSolution: optimalSolution,
        });

        // Store path if requested
        if (storePath) {
            // Convert from readonly API to string[]
            const learningUnitsIds = [...path.learningUnits];

            return await this.historyService.addPersonalizedLearningPathToUser({
                userId,
                learningUnitsIds,
                pathId,
            });
        } else {
            return EnrollmentPreviewResponseDto.createFromDao({
                unitSequence: path.learningUnits,
                learningPathId: pathId,
            });
        }
    }

    /**
     * Specifies a custom, self-defined learning path created the user by specifying the goal.
     * @param userId The user for whom the course should be personalized to
     * @param goal The targeted skills to be obtained by the custom path
     * @param storePath if true, the path will be stored in the user's learning history otherwise only the path will be returned as a preview
     * @param optimalSolution If true, the algorithm will try to find an optimal path, at cost of performance.
     * @returns Either the stored personalized path (storePath = true) or a preview of the path (storePath = false)
     */
    public async enrollmentByGoal(
        userId: string,
        goal: string[],
        storePath: boolean = true,
        optimalSolution: boolean = false,
    ) {
        // Compute path for the user
        const path = await this.computePath({
            goal: goal,
            userId: userId,
            optimalSolution: optimalSolution,
        });

        // Store path if requested
        if (storePath) {
            // Convert from readonly API to string[]
            const learningUnitsIds = [...path.learningUnits];

            return await this.historyService.addPersonalizedLearningPathToUser({
                userId,
                learningUnitsIds,
                pathTeachingGoalsIds: goal,
            });
        } else {
            return CustomCoursePreviewResponseDto.createFromDao({
                unitSequence: path.learningUnits,
                goal: goal,
            });
        }
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
            goal,
        });

        if (!skillAnalyzedPath) {
            throw new NotFoundException(
                `There is a learning path for the goal: ${dto.goal}, try to use computePath`,
            );
        }

        const subPathDtoList = new SubPathListDto();
        skillAnalyzedPath.forEach((analyzedPath) => {
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
        const newPath = await this.db.personalizedLearningPath.create({
            data: {
                learningHistoryId: learningHistory.userId,
                learningPathId: dto.originPathId,
                pathTeachingGoals: {
                    connect: goals.map((goal) => ({ id: goal })),
                },
                unitSequence: {
                    create: dto.units.map((unitId, index) => ({
                        unitId: unitId,
                        position: index,
                    })),
                },

                lifecycle: "CREATED",
            },
            include: {
                unitSequence: {
                    include: {
                        unit: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                },
                pathTeachingGoals: true,
                learningHistory: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!newPath) {
            throw new NotFoundException(`Could not store path: ${dto}`);
        }

        return PathStorageResponseDto.createFromDao(newPath);
    }
}
