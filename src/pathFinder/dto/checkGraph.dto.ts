import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { ResolvedSkillDto } from '../../skills/dto';


export class CheckGraphDto {
  @IsNotEmpty()
  isAcyclic: boolean;

  constructor(isAcyclic: boolean) {
    this.isAcyclic = isAcyclic;
    
  }
}
