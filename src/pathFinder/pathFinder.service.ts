import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillDto } from '../skills/dto';
import { isSelfLearnLearningUnitDto, isSearchLearningUnitDto } from '../learningUnit/types';
import { Graph, alg } from '@dagrejs/graphlib';
import { LearningUnitMgmtService } from '../learningUnit/learningUnit.service';
import { SkillMgmtService } from '../skills/skill.service';
import { PathDto, CheckGraphDto, EdgeDto, GraphDto, NodeDto } from './dto';
import { GraphWrapper as GraphWrapper } from './graph';
import { ConfigService } from '@nestjs/config';
import { LearningUnitFactory } from '../learningUnit/learningUnitFactory';

/**
 * Service for Graphrequests 
 * @author Wenzel
 */
@Injectable()
export class PathFinderService {
  
  constructor(
    private db: PrismaService,
    private luService: LearningUnitMgmtService,
    private luFactory: LearningUnitFactory,
    private config: ConfigService,
    private skillService: SkillMgmtService
  ) {}

  

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
      g.setNode('sk' + element1.id, {name:element1.name, level:element1.level, description:element1.description} );

      element1.nestedSkills.forEach((element) => {
        g.setEdge('sk' + element.id, 'sk' + element1.id);
      });
    });
    const lus = await this.luService.loadAllLearningUnits();
    // lus.learningUnits = <SelfLearnLearningUnitDto[]>lus.learningUnits;
    for (let i = 0; i < lus.learningUnits.length; i++) {
      const unit = lus.learningUnits[i];
      if (
        (isSelfLearnLearningUnitDto(unit) &&  Number(unit.selfLearnId) > 20) ||
        (isSearchLearningUnitDto(unit) &&  Number(unit.searchId) > 20)
      ) {
        lus.learningUnits.splice(i--, 1);
      }
    }
    lus.learningUnits.forEach((elem) => {
      const unitId = isSelfLearnLearningUnitDto(elem) ? elem.selfLearnId : elem.searchId;
 
      g.setNode('lu' + unitId, {titel:elem.title});
      elem.requiredSkills.forEach((element) => {
        g.setEdge('sk' + element, 'lu' + unitId);
      });
      elem.teachingGoals.forEach((element) => {
        g.setEdge('lu' + unitId, 'sk' + element);
      });
    });
    return g;
  }

  public async getSkillGraphForSkillId(skill: SkillDto): Promise<Graph> {
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
      g.setNode('sk' + element1.id, {name:element1.name, level:element1.level, description:element1.description} );
      element1.nestedSkills.forEach((element) => {
        g.setEdge('sk' + element.id, 'sk' + element1.id);
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

  public async getConnectedSkillGraphForSkill(skillId: string) {
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
    const g = await this.getSkillGraphForSkillId(skill);

    const nodeList: NodeDto[] = [];
    const edgeList: EdgeDto[] = [];

    g.nodes().forEach((element) => {
      const label = g.node(element);
      
      const node = new NodeDto(element, label, );
      nodeList.push(node);
    });
    g.edges().forEach((element) => {
      const edge = new EdgeDto(element.v, element.w);
      edgeList.push(edge);
    });
    const gr = new GraphDto(edgeList, nodeList);
    return gr;
  }

  public async findLuForRep(repId: string) {
    const learningUnits = await this.db.learningUnit.findMany({
      include: {
        teachingGoals: true,
        requirements: true,
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
  public async getConnectedGraphForSkillwithResolvedElements(skillId: string) {
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
    const graph = new GraphWrapper(this.db, this.luFactory, this.config);
    return graph.getGraphForSkillId(skill);
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
    const retVal = new CheckGraphDto(alg.isAcyclic(g));
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
    const b: string[] = [];
    a.forEach((element) => {
      if (element.includes('lu')) {
        b.push(element);
      }
    });
    const retVal = new PathDto(b);
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
    g.setNode('sk' + 0, {name:'Know Nothing', level:0, description:'Know Nothing'} );
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
        (isSelfLearnLearningUnitDto(unit) &&  Number(unit.selfLearnId) > 20) ||
        (isSearchLearningUnitDto(unit) &&  Number(unit.searchId) > 20)
      ) {
        lus.learningUnits.splice(i--, 1);
      }
    }
    lus.learningUnits.forEach((elem) => {
      const unitId = isSelfLearnLearningUnitDto(elem) ? elem.selfLearnId : elem.searchId;
   
      g.setNode('lu' + unitId, {titel:elem.title});
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

  public findMissingElements(list1: string[], list2: string[]): string[] {
    const missingElements: string[] = [];
  
    for (const element of list1) {
      if (!list2.includes(element)) {
        missingElements.push(element);
      }
    }
  
    return missingElements;
  }

  public async allSkillsDone(repoId: string) {
    const test = await this.findLuForRep(repoId)
    const test2 =await this.skillService.loadSkillRepository(repoId)
    const locList : string[] = []
    test2.skills.forEach(element => {
      locList.push(element)
      
    });

    const locList2 : string[] = []
    test.forEach(element => {
      element.teachingGoals.forEach(element => {
        locList2.push(element.id)
      });
      
    });
    const missingElements = this.findMissingElements(locList, locList2);
    console.log(locList)
    console.log(locList2)
    console.log(missingElements)
    return test
  }
}
