import { Injectable, NotFoundException } from '@nestjs/common';
import { LearningUnitFactory } from '../learningUnit/learningUnitFactory';
import { SearchEdgeDto, SearchGraphDto, SelfLearnEdgeDto } from './dto';
import { Graph } from '@dagrejs/graphlib';
import { SkillMgmtService } from '../skills/skill.service';
import { SkillDto } from '../skills/dto';
import { SelfLearnGraphDto } from './dto/selflearn-graph.dto';
import { SearchLearningUnitDto, SelfLearnLearningUnitDto } from '../learningUnit/dto';
import { isSearchLearningUnitDto, isSelfLearnLearningUnitDto } from '../learningUnit/types';
import { ConfigService } from '@nestjs/config';
import { MODE } from '../config/env.validation';

@Injectable()
export class GraphMapper {
  private readonly extension: MODE;

  constructor(
    private luFactory: LearningUnitFactory,
    private skillService: SkillMgmtService,
    private config: ConfigService,
  ) {
    const tmp = this.config.get('EXTENSION');
    if (tmp) {
      this.extension = tmp;
    } else {
      throw new Error('No project-specific extension defined');
    }
  }

  public async graphToDto(graph: Graph) {
    switch (this.extension) {
      case MODE.SEARCH:
        return this.graphToSearchDto(graph);
      case MODE.SELFLEARN:
        return this.graphToSelfLearnDto(graph);
      default:
        throw new Error(`Unknown extension mode: ${this.extension}`);
    }
  }

  private async graphToSelfLearnDto(graph: Graph) {
    const result = new SelfLearnGraphDto();
    const skills = new Map<string, SkillDto>();
    const learningUnits = new Map<string, SelfLearnLearningUnitDto>();
    const edgeList: SelfLearnEdgeDto[] = [];

    await this.nodeToDtos(graph, skills, learningUnits, isSelfLearnLearningUnitDto);
    result.skills = Array.from(skills.values());
    result.learningUnits = Array.from(learningUnits.values());

    graph.edges().forEach((element) => {
      const fromNode = this.getNode(element.v, skills, learningUnits);
      const toNode = this.getNode(element.w, skills, learningUnits);

      const edge = new SelfLearnEdgeDto(fromNode, toNode);
      edgeList.push(edge);
    });
    result.edges = edgeList;

    return result;
  }

  private async graphToSearchDto(graph: Graph) {
    const result = new SearchGraphDto();
    const skills = new Map<string, SkillDto>();
    const learningUnits = new Map<string, SearchLearningUnitDto>();
    const edgeList: SearchEdgeDto[] = [];

    await this.nodeToDtos(graph, skills, learningUnits, isSearchLearningUnitDto);
    result.skills = Array.from(skills.values());
    result.learningUnits = Array.from(learningUnits.values());

    graph.edges().forEach((element) => {
      const fromNode = this.getNode(element.v, skills, learningUnits);
      const toNode = this.getNode(element.w, skills, learningUnits);

      const edge = new SearchEdgeDto(fromNode, toNode);
      edgeList.push(edge);
    });
    result.edges = edgeList;

    return result;
  }

  private getNode<LuType>(nodeId: string, skills: Map<string, SkillDto>, learningUnits: Map<string, LuType>) {
    let nodeDto;
    if (nodeId.startsWith('sk')) {
      nodeDto = skills.get(nodeId);
    } else if (nodeId.startsWith('lu')) {
      nodeDto = learningUnits.get(nodeId);
    } else {
      throw new Error(`Node is neither skill nor learningUnit: ${nodeId}`);
    }

    if (!nodeDto) {
      const skillIds = Array.from(skills.keys());
      throw new NotFoundException(`Node not found: ${nodeId} with ${skillIds}`);
    }

    return nodeDto;
  }

  /**
   * Converts all elements of the graph (nodes and edges) to project-specific DTOs and adds them to the given maps (as side-effect).
   * Runs the conversion in parallel and waits until the last element is converted.
   * @param graph The graph to be converted.
   * @param skills And empty map that will be filled with the converted skills.
   * @param learningUnits An empty map that will be filled with the converted learningUnits.
   * @param typeGuard The project-specific type guard to check if the learningUnit is of the correct type.
   */
  private async nodeToDtos<LuType>(
    graph: Graph,
    skills: Map<string, SkillDto>,
    learningUnits: Map<string, LuType>,
    typeGuard: (dto: any) => dto is LuType,
  ) {
    await Promise.all(
      graph.nodes().map(async (nodeId) => {
        if (nodeId.startsWith('sk')) {
          const skillId = nodeId.substring(2);
          const skill = await this.skillService.getSkill(skillId);
          skills.set(nodeId, skill);
          // TODO SE: Check if same skills can be used multiple times -> check if they are already contained in the map
        } else {
          const learningUnitId = nodeId.substring(2);
          const learningUnit = await this.luFactory.getLearningUnit(learningUnitId);
          if (typeGuard(learningUnit)) {
            learningUnits.set(nodeId, learningUnit);
          } else {
            throw new Error(`LearningUnit is not a project-specific: ${learningUnitId}`);
          }
          // TODO SE: Check if same learningUnits can be used multiple times -> check if they are already contained in the map
        }
      }),
    );
  }
}
