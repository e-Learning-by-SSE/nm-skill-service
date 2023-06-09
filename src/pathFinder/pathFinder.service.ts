import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillMgmtService } from 'src/skills/skill.service';
import { SkillDto } from 'src/skills/dto';
import { SelfLearnLearningUnitDto } from 'src/learningUnit/dto';

import { Graph, json, alg } from '@dagrejs/graphlib';
import { LearningUnitMgmtService } from 'src/learningUnit/learningUnit.service';

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
    lus.learningUnits = <SelfLearnLearningUnitDto[]>lus.learningUnits;
    for (let i = 0; i < lus.learningUnits.length; i++) {
      if (lus.learningUnits[i].selfLearnId > 20) {
        lus.learningUnits.splice(i--, 1);
      }
    }
    lus.learningUnits.forEach((elem) => {
      g.setNode('lu' + elem.selfLearnId, elem.title);
      elem.requiredSkills.forEach((element) => {
        g.setEdge('sk' + element, 'lu' + elem.selfLearnId);
      });
      elem.teachingGoals.forEach((element) => {
        g.setEdge('lu' + elem.selfLearnId, 'sk' + element);
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
    return json.write(g);
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
    return alg.isAcyclic(g);
  }

  public async pathForSkill(skillId: string) {
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
    console.log(alg.postorder(g, ['sk' + skillId]));
    console.log(alg.topsort(g));
    return alg.topsort(g);
  }
}
