import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SkillDto } from "../skills/dto";
import { SkillMgmtService } from "../skills/skill.service";
import { PathDto, CheckGraphDto, EdgeDto, GraphDto, NodeDto, PathRequestDto } from "./dto";
import { ConfigService } from "@nestjs/config";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import {
    LearningUnitProvider,
    LearningUnit,
    Skill,
    isAcyclic,
    getPath,
    getConnectedGraphForLearningUnit,
} from "../../nm-skill-lib/src";

/**
 * Service for Graphrequests
 * @author Wenzel
 */
@Injectable()
export class PathFinderService implements LearningUnitProvider<LearningUnit> {
    constructor(
        private db: PrismaService,
        // private luService: LearningUnitMgmtService,
        private luFactory: LearningUnitFactory,
        private config: ConfigService,
        private skillService: SkillMgmtService,
    ) {}

    async getLearningUnitsBySkillIds(skillIds: string[]): Promise<LearningUnit[]> {
        const relevantLUs = await this.luFactory.loadAllLearningUnits({
            where: {
                OR: {
                    teachingGoals: {
                        some: {
                            id: {
                                in: skillIds,
                            },
                        },
                    },
                },
            },
        });

        const results: LearningUnit[] = [];

        relevantLUs.learningUnits.forEach((lu) => {
            results.push({
                ...lu,
                id: lu.searchId,
            });
        });

        return results;
    }

    async getSkillsByRepository(repositoryId: string): Promise<Skill[]> {
        const skills = await this.db.skill.findMany({
            where: {
                repositoryId: repositoryId,
            },

            include: {
                nestedSkills: true,
            },
        });

        return skills.map((skill) => ({
            id: skill.id,
            repositoryId: skill.repositoryId,
            nestedSkills: skill.nestedSkills.map((skill) => skill.id),
        }));
    }

    public async getConnectedGraphForSkill(skillId: string, includeLearningUnits: boolean) {
        const daoSkillIn = await this.db.skill.findUnique({
            where: {
                id: skillId,
            },
            include: { nestedSkills: true },
        });

        if (!daoSkillIn) {
            throw new NotFoundException(`Specified skill not found: ${skillId}`);
        }

        // const skill = SkillDto.createFromDao(daoSkillIn);
        const skills = await this.getSkillsByRepository(daoSkillIn.repositoryId);
        const graph = await getConnectedGraphForLearningUnit(this, skills);

        // TODO SE: Check what label is needed, e.g., title of learning units
        const nodeList: NodeDto[] = graph.nodes.map(
            (node) => new NodeDto(node.id, node.element.id),
        );
        const edgeList: EdgeDto[] = graph.edges.map((edge) => new EdgeDto(edge.from, edge.to));
        return new GraphDto(edgeList, nodeList);
    }

    public async findLuForRep(repId: string) {
        const learningUnits = await this.db.learningUnit.findMany({
            include: {
                teachingGoals: true,
            },
            where: {
                OR: {
                    requirements: {
                        some: {
                            repositoryId: repId,
                        },
                    },
                    teachingGoals: {
                        some: {
                            repositoryId: repId,
                        },
                    },
                },
            },
        });
        if (!learningUnits) {
            throw new NotFoundException(`Specified skill not found: ${repId}`);
        }

        return learningUnits;
    }

    public async isGraphForIdACycle(skillId: string) {
        const daoSkillIn = await this.db.skill.findUnique({
            where: {
                id: skillId,
            },
            include: { nestedSkills: true },
        });
        if (!daoSkillIn) {
            throw new NotFoundException(`Specified skill not found: ${skillId}`);
        }

        const skills = await this.getSkillsByRepository(daoSkillIn.repositoryId);
        const skillIds = [...new Set(skills.map((skill) => skill.id))];
        const allLUs = await this.getLearningUnitsBySkillIds(skillIds);

        isAcyclic(skills, allLUs);

        return new CheckGraphDto(await isAcyclic(skills, allLUs));
    }

    private async loadUser(userId: string) {
        const user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
                learningProfile: true,
                skillProfile: true,
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
        const goals = await this.loadSkills(dto.goal);

        // Find all skills that are in the same repository as the goals (most likely to find a solution for them)
        // Could be revised in future if algorithm detects relevant skills
        const repositories = [...new Set(goals.map((goal) => goal.repositoryId))];
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
            luProvider: this,
            desiredSkills: goals,
            ownedSkill: knowledge,
            optimalSolution: dto.optimalSolution,
        });

        if (!path) {
            throw new NotFoundException(
                `Could not compute a path for the specified goal: ${dto.goal}`,
            );
        }
        return new PathDto(
            path.path.map((lu) => lu.id),
            path.cost,
        );
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

    public async allSkillsDone(repoId: string) {
        const learningUnits = await this.findLuForRep(repoId);
        const skillRepo = await this.skillService.loadSkillRepository(repoId);
        const definedSkills = skillRepo.skills.map((skill) => skill);
        // const locList: string[] = [];
        // skillRepo.skills.forEach((element) => {
        //   locList.push(element);
        // });

        const taughtSkills: string[] = learningUnits
            .map((lu) => lu.teachingGoals.map((goal) => goal.id))
            .flat();
        // const locList2: string[] = [];
        // learningUnits.forEach((element) => {
        //   element.teachingGoals.forEach((element) => {
        //     locList2.push(element.id);
        //   });
        // });
        const untaughtSkills = definedSkills.filter((skill) => !taughtSkills.includes(skill));
        // const missingElements = this.findMissingElements(locList, locList2);
        return learningUnits;
    }
}
