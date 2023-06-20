import { PrismaService } from '../prisma/prisma.service';
import { LearningUnitDtoTyp, isSearchLearningUnitDto, isSelfLearnLearningUnitDto } from '../learningUnit/types';
import { SkillDto } from '../skills/dto';
import { Graph as GraphLib, alg } from '@dagrejs/graphlib';
import { Prisma, Skill } from '@prisma/client';
import { LearningUnitFactory } from '../learningUnit/learningUnitFactory';
import { MODE } from '../config/env.validation';
import { SearchEdgeDto, SearchGraphDto, SelfLearnEdgeDto, SelfLearnGraphDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class GraphWrapper {
  /**
   * Maps IDs to SkillDtos in form of sk<id>
   */
  private usedSkills = new Map<string, SkillDto>();
  private usedLUs = new Map<string, LearningUnitDtoTyp>();

  /**
   * The internally used library, should not be exported (principle of information hiding)
   */
  private graph = new GraphLib({ directed: true, multigraph: true });

  private readonly extension: MODE;

  constructor(private db: PrismaService, private luFactory: LearningUnitFactory, private config: ConfigService) {
    const tmp = this.config.get('EXTENSION');
    if (tmp) {
      this.extension = tmp;
    } else {
      throw new Error('No project-specific extension defined');
    }
  }

  private getNode<LuType extends LearningUnitDtoTyp>(
    nodeId: string,
    typeGuard: (dto: LearningUnitDtoTyp) => dto is LuType,
  ) {
    let nodeDto;
    if (nodeId.startsWith('sk')) {
      nodeDto = this.usedSkills.get(nodeId);
    } else if (nodeId.startsWith('lu')) {
      const tmp = this.usedLUs.get(nodeId);
      if (tmp && typeGuard(tmp)) {
        nodeDto = tmp;
      }
    } else {
      throw new Error(`Node is neither skill nor learningUnit: ${nodeId}`);
    }

    if (!nodeDto) {
      throw new NotFoundException(`Node not found: ${nodeId}`);
    }

    return nodeDto;
  }

  private skillToDto(skill: Skill): [string, SkillDto] {
    const id = 'sk' + skill.id;
    let dto = this.usedSkills.get(id);
    if (!dto) {
      dto = SkillDto.createFromDao(skill);
      this.usedSkills.set(id, dto);
    }
    return [id, dto];
  }

  private async loadRelevantLearningUnits() {
    const usedRepositoriesTmp = new Set<string>();
    this.usedSkills.forEach((skill) => usedRepositoriesTmp.add(skill.repositoryId));
    const usedRepositories = Array.from(usedRepositoriesTmp);

    const luArgs: Prisma.LearningUnitFindManyArgs = {
      include: {
        teachingGoals: true,
        requirements: true,
      },
      where: {
        OR: {
          teachingGoals: {
            some: {
              repositoryId: {
                in: usedRepositories,
              },
            },
          },
          requirements: {
            some: {
              repositoryId: {
                in: usedRepositories,
              },
            },
          },
        },
      },
    };
    return this.luFactory.loadAllLearningUnits(luArgs);
  }

  public async getGraphForSkillId(skill: SkillDto) {
    const allSkills = await this.db.skill.findMany({
      where: {
        repositoryId: skill.repositoryId,
      },
      include: {
        nestedSkills: true,
      },
    });

    allSkills.forEach((element) => {
      const [id, dto] = this.skillToDto(element);
      this.graph.setNode(id, dto);

      element.nestedSkills.forEach((child) => {
        const [id, childDto] = this.skillToDto(child);
        this.graph.setNode(id, childDto);
      });
    });

    const lus = await this.loadRelevantLearningUnits();
    // TODO SE: @ CW: Please explain why this is necessary
    for (let i = 0; i < lus.learningUnits.length; i++) {
      const unit = lus.learningUnits[i];
      if (
        (isSelfLearnLearningUnitDto(unit) && unit.selfLearnId > 20) ||
        (isSearchLearningUnitDto(unit) && unit.searchId > 20)
      ) {
        lus.learningUnits.splice(i--, 1);
      }
    }

    lus.learningUnits.forEach((lu) => {
      const unitId = 'lu' + (isSelfLearnLearningUnitDto(lu) ? lu.selfLearnId : lu.searchId);
      this.usedLUs.set(unitId, lu);

      this.graph.setNode(unitId, lu);
      lu.requiredSkills.forEach((skill) => {
        this.graph.setEdge('sk' + skill, unitId);
      });
      lu.teachingGoals.forEach((skill) => {
        this.graph.setEdge(unitId, 'sk' + skill);
      });
    });

    switch (this.extension) {
      case MODE.SEARCH:
        const searchResult = new SearchGraphDto();
        for (const edge of this.graph.edges()) {
          const fromNode = this.getNode(edge.v, isSearchLearningUnitDto);
          const toNode = this.getNode(edge.w, isSearchLearningUnitDto);
          const edgeDto = new SearchEdgeDto(fromNode, toNode);
          if (edgeDto) {
            searchResult.edges.push(edgeDto);
          }
        }
        return searchResult;
      case MODE.SELFLEARN:
        const selfLearnResult = new SelfLearnGraphDto();
        for (const edge of this.graph.edges()) {
          const fromNode = this.getNode(edge.v, isSelfLearnLearningUnitDto);
          const toNode = this.getNode(edge.w, isSelfLearnLearningUnitDto);
          const edgeDto = new SelfLearnEdgeDto(fromNode, toNode);
          if (edgeDto) {
            selfLearnResult.edges.push(edgeDto);
          }
        }
        return selfLearnResult;
      default:
        throw new Error(`Unknown extension mode: ${this.extension}`);
    }
  }
}
