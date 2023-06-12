import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { EdgeDto } from './edge.dto';
import { NodeDto } from './node.dto';


export class PathDto {
  @IsNotEmpty()
  luIDs: String[];

  constructor(luIDs: String[]) {
    this.luIDs = luIDs;
    
  }
}
