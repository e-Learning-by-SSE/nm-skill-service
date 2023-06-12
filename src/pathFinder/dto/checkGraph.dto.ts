import { IsNotEmpty } from 'class-validator';

export class CheckGraphDto {
  @IsNotEmpty()
  isAcyclic: boolean;

  constructor(isAcyclic: boolean) {
    this.isAcyclic = isAcyclic;
  }
}
