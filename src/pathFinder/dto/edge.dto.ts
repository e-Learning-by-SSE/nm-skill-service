import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { ResolvedSkillDto } from '../../skills/dto';

export class EdgeDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
