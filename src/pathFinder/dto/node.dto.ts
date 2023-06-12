import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { ResolvedSkillDto } from '../../skills/dto';


export class NodeDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
