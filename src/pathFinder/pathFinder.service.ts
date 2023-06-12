import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillMgmtService } from 'src/skills/skill.service';
import { SkillDto } from 'src/skills/dto';
import { SelfLearnLearningUnitDto } from 'src/learningUnit/dto';
import { isSelfLearnLearningUnitDto, isSearchLearningUnitDto } from '../learningUnit/types';
import { Graph, json, alg } from '@dagrejs/graphlib';
import { LearningUnitMgmtService } from 'src/learningUnit/learningUnit.service';
import { NodeDto, GraphDto, EdgeDto, CheckGraphDto } from './dto';
import { PathDto } from './dto/path.dto';

/**
 * Service that manages the creation/update/deletion Nuggets
 * @author Wenzel
 */
@Injectable()
export class PathFinderService {
  constructor(
    private db: PrismaService,
    private skillService: SkillMgmtService,
    private luService: LearningUnitMgmtService,
  ) {}

  /**
   * Adds a new nugget
   * @param dto Specifies the nugget to be created
   * @returns The newly created nugget

   */

  public async loadAllNuggets() {
    const nuggets = await this.db.nugget.findMany();
    if (!nuggets) {
      throw new NotFoundException('Can not find any nuggets');
    }
    return nuggets;
  }
  public async getGraphForSkillId(skill: SkillDto): Promise<Graph> {
    const allSkills = await this.db.skill.findMany({
      where: {
        repositoryId: skill.repositoryId,
      },
      include: {
        nestedSkills: true,
      },
    });

    const g = new Graph({ directed: true, multigraph: true });
    allSkills.forEach((element1) => {
      g.setNode('sk' + element1.id, element1.name);

      element1.nestedSkills.forEach((element) => {
        g.setEdge('sk' + element.id, 'sk' + element1.id);
      });
    });
    const lus = await this.luService.loadAllLearningUnits();
    // lus.learningUnits = <SelfLearnLearningUnitDto[]>lus.learningUnits;
    for (let i = 0; i < lus.learningUnits.length; i++) {
      const unit = lus.learningUnits[i];
      if (
        (isSelfLearnLearningUnitDto(unit) && unit.selfLearnId > 20) ||
        (isSearchLearningUnitDto(unit) && unit.searchId > 20)
      ) {
        lus.learningUnits.splice(i--, 1);
      }
    }
    lus.learningUnits.forEach((elem) => {
      const unitId = isSelfLearnLearningUnitDto(elem) ? elem.selfLearnId : elem.searchId;
      g.setNode('lu' + unitId, elem.title);
      elem.requiredSkills.forEach((element) => {
        g.setEdge('sk' + element, 'lu' + unitId);
      });
      elem.teachingGoals.forEach((element) => {
        g.setEdge('lu' + unitId, 'sk' + element);
      });
    });
    return g;
  }

  public async getConnectedGraphForSkill(skillId: string) {
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

    const nodeList: NodeDto[] = [];
    const edgeList: EdgeDto[] = [];

    g.nodes().forEach((element) => {
      const label = g.node(element);
      const node = new NodeDto(element, label);
      nodeList.push(node);
    });
    g.edges().forEach((element) => {
      const edge = new EdgeDto(element.v, element.w);
      edgeList.push(edge);
    });
    const gr = new GraphDto(edgeList, nodeList);
    return gr;
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
    const skill = SkillDto.createFromDao(daoSkillIn);
    const g = await this.getGraphForSkillId(skill);
    const retVal = new CheckGraphDto(alg.isAcyclic(g))
    return retVal;
  }

  public async pathForSkill() {
    const skillId: string = '1';
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
    const g = await this.getGraphWithKnowNothing(skill);

    const a = alg.preorder(g, ['sk0']);
    const b: String[] = [];
    a.forEach((element) => {
      if (element.includes('lu')) {
        b.push(element);
      }
    });
    const retVal = new PathDto(b)
    return retVal;
  }
  public async getGraphWithKnowNothing(skill: SkillDto): Promise<Graph> {
    const allSkills = await this.db.skill.findMany({
      where: {
        repositoryId: skill.repositoryId,
      },
      include: {
        nestedSkills: true,
      },
    });

    const g = new Graph({ directed: true, multigraph: true });
    g.setNode('sk0', 0);
    allSkills.forEach((element1) => {
      g.setNode('sk' + element1.id, element1.name);

      element1.nestedSkills.forEach((element) => {
        g.setEdge('sk' + element.id, 'sk' + element1.id);
      });
    });
    const lus = await this.luService.loadAllLearningUnits();
    // lus.learningUnits = <SelfLearnLearningUnitDto[]>lus.learningUnits;
    for (let i = 0; i < lus.learningUnits.length; i++) {
      const unit = lus.learningUnits[i];
      if (
        (isSelfLearnLearningUnitDto(unit) && unit.selfLearnId > 20) ||
        (isSearchLearningUnitDto(unit) && unit.searchId > 20)
      ) {
        lus.learningUnits.splice(i--, 1);
      }
    }
    lus.learningUnits.forEach((elem) => {
      const unitId = isSelfLearnLearningUnitDto(elem) ? elem.selfLearnId : elem.searchId;
      g.setNode('lu' + unitId, elem.title);
      if (!elem.requiredSkills.length) {
        g.setEdge('sk0', 'lu' + unitId);
      } else {
        elem.requiredSkills.forEach((element) => {
          g.setEdge('sk' + element, 'lu' + unitId);
        });
      }
      elem.teachingGoals.forEach((element) => {
        g.setEdge('lu' + unitId, 'sk' + element);
      });
    });
    return g;
  }
}
