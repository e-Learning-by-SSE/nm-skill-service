import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { EdgeDto } from './edge.dto';
import { NodeDto } from './node.dto';


export class GraphDto {
  @IsNotEmpty()
  edges: EdgeDto[];

  @IsNotEmpty()
  nodes: NodeDto[];

  constructor(edges: EdgeDto[], nodes: NodeDto[]) {
    this.edges = edges;
    this.nodes = nodes;
  }
}
