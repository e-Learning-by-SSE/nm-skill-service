import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillDto } from '../skills/dto';
import { SkillMgmtService } from '../skills/skill.service';
import { PathDto, CheckGraphDto, EdgeDto, GraphDto, NodeDto, PathRequestDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { LearningUnitFactory } from '../learningUnit/learningUnitFactory';
import {
  LearningUnitProvider,
  LearningUnit,
  Skill,
  isAcyclic,
  getPath,
  getConnectedGraphForLearningUnit,
} from '../../nm-skill-lib/src';

/**
 * Service for Graphrequests
 * @author Wenzel
 */
@Injectable()
export class PathFinderService implements LearningUnitProvider {
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

  // public async loadAllNuggets() {
  //   const nuggets = await this.db.nugget.findMany();
  //   if (!nuggets) {
  //     throw new NotFoundException('Can not find any nuggets');
  //   }
  //   return nuggets;
  // }
  // public async getGraphForSkillId(skill: SkillDto): Promise<Graph> {
  //   const allSkills = await this.db.skill.findMany({
  //     where: {
  //       repositoryId: skill.repositoryId,
  //     },
  //     include: {
  //       nestedSkills: true,
  //     },
  //   });

  //   const g = new Graph({ directed: true, multigraph: true });
  //   allSkills.forEach((element1) => {
  //     g.setNode('sk' + element1.id, { name: element1.name, level: element1.level, description: element1.description });

  //     element1.nestedSkills.forEach((element) => {
  //       g.setEdge('sk' + element.id, 'sk' + element1.id);
  //     });
  //   });
  //   const lus = await this.luService.loadAllLearningUnits();
  //   // lus.learningUnits = <SelfLearnLearningUnitDto[]>lus.learningUnits;
  //   for (let i = 0; i < lus.learningUnits.length; i++) {
  //     const unit = lus.learningUnits[i];
  //     if (
  //       (isSelfLearnLearningUnitDto(unit) && Number(unit.selfLearnId) > 20) ||
  //       (isSearchLearningUnitDto(unit) && Number(unit.searchId) > 20)
  //     ) {
  //       lus.learningUnits.splice(i--, 1);
  //     }
  //   }
  //   lus.learningUnits.forEach((elem) => {
  //     const unitId = isSelfLearnLearningUnitDto(elem) ? elem.selfLearnId : elem.searchId;

  //     g.setNode('lu' + unitId, { titel: elem.title });
  //     /*   elem.requiredSkills.forEach((element) => {
  //       g.setEdge('sk' + element, 'lu' + unitId);
  //     });*/
  //     elem.teachingGoals.forEach((element) => {
  //       g.setEdge('lu' + unitId, 'sk' + element);
  //     });
  //   });
  //   return g;
  // }

  // public async getSkillGraphForSkillId(skill: SkillDto): Promise<Graph> {
  //   const allSkills = await this.db.skill.findMany({
  //     where: {
  //       repositoryId: skill.repositoryId,
  //     },
  //     include: {
  //       nestedSkills: true,
  //     },
  //   });

  //   const g = new Graph({ directed: true, multigraph: true });
  //   allSkills.forEach((element1) => {
  //     g.setNode('sk' + element1.id, { name: element1.name, level: element1.level, description: element1.description });
  //     element1.nestedSkills.forEach((element) => {
  //       g.setEdge('sk' + element.id, 'sk' + element1.id);
  //     });
  //   });

  //   return g;
  // }

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
    const nodeList: NodeDto[] = graph.nodes.map((node) => new NodeDto(node.id, node.element.id));
    const edgeList: EdgeDto[] = graph.edges.map((edge) => new EdgeDto(edge.from, edge.to));
    return new GraphDto(edgeList, nodeList);

    // const g = await this.getGraphForSkillId(skill);

    // const nodeList: NodeDto[] = [];
    // const edgeList: EdgeDto[] = [];

    // g.nodes().forEach((element) => {
    //   const label = g.node(element);
    //   const node = new NodeDto(element, label);
    //   nodeList.push(node);
    // });
    // g.edges().forEach((element) => {
    //   const edge = new EdgeDto(element.v, element.w);
    //   edgeList.push(edge);
    // });
    // const gr = new GraphDto(edgeList, nodeList);
    // return gr;
  }

  // public async getConnectedSkillGraphForSkill(skillId: string) {
  //   const daoSkillIn = await this.db.skill.findUnique({
  //     where: {
  //       id: skillId,
  //     },
  //     include: { nestedSkills: true },
  //   });

  //   if (!daoSkillIn) {
  //     throw new NotFoundException(`Specified skill not found: ${skillId}`);
  //   }
  //   const skill = SkillDto.createFromDao(daoSkillIn);
  //   const g = await this.getSkillGraphForSkillId(skill);

  //   const nodeList: NodeDto[] = [];
  //   const edgeList: EdgeDto[] = [];

  //   g.nodes().forEach((element) => {
  //     const label = g.node(element);

  //     const node = new NodeDto(element, label);
  //     nodeList.push(node);
  //   });
  //   g.edges().forEach((element) => {
  //     const edge = new EdgeDto(element.v, element.w);
  //     edgeList.push(edge);
  //   });
  //   const gr = new GraphDto(edgeList, nodeList);
  //   return gr;
  // }

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

  /*
  public async getConnectedGraphForSkillProposal(skillId: string) {
    const daoSkillIn = await this.db.skill.findUnique({
      where: {
        id: skillId,
      },
      include: { nestedSkills: true },
    });

    if (!daoSkillIn) {
      throw new NotFoundException(`Specified skill not found: ${skillId}`);
    }
    const skill = SkillDto.createFromDao(daoSkillIn);
    const g = await this.getGraphForSkillId(skill);

    return this.graphMapper.graphToDto(g);
  }
*/
  // public async getConnectedGraphForSkillwithResolvedElements(skillId: string) {
  //   const daoSkillIn = await this.db.skill.findUnique({
  //     where: {
  //       id: skillId,
  //     },
  //     include: { nestedSkills: true },
  //   });

  //   if (!daoSkillIn) {
  //     throw new NotFoundException(`Specified skill not found: ${skillId}`);
  //   }

  //   const skill = SkillDto.createFromDao(daoSkillIn);
  //   const graph = new GraphWrapper(this.db, this.luFactory, this.config);
  //   return graph.getGraphForSkillId(skill);
  // }

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

  public async pathForSkill(goalId: string) {
    const goalDAO = await this.db.skill.findUnique({
      where: {
        id: goalId,
      },
      include: { nestedSkills: true },
    });

    if (!goalDAO) {
      throw new NotFoundException(`Specified skill not found: ${goalId}`);
    }
    const goal = SkillDto.createFromDao(goalDAO);

    const skills = await this.getSkillsByRepository(goalDAO.repositoryId);
    const path = await getPath({ skills: skills, luProvider: this, desiredSkills: [goal], ownedSkill: [] });

    return new PathDto(path);
  }

  public async computePath(dto: PathRequestDto) {
    const goals = await this.loadSkills(dto.goal);

    // Find all skills that are in the same repository as the goals (most likely to find a solution for them)
    // Could be revised in future if algorithm detects relevant skills
    const repositories = [...new Set(goals.map((goal) => goal.repositoryId))];
    const skills = await this.loadAllSkillsOfRepositories(repositories);

    // TODO SE:
    if (dto.userId) {
      // 1. Load user if userId was provided
      // 2. Find all skills that the user already has
      // 3. Develop cost function based on UserProfile
    }

    const path = await getPath({ skills: skills, luProvider: this, desiredSkills: goals, ownedSkill: [] });
    return new PathDto(path);
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
      throw new NotFoundException(`Could not find any skill for the specified repositories: ${repositories}`);
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

    const taughtSkills: string[] = learningUnits.map((lu) => lu.teachingGoals.map((goal) => goal.id)).flat();
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
