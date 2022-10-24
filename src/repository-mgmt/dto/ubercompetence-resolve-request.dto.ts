import { IsDefined } from 'class-validator';

export class UberCompetenceResolveRequestDto {
  @IsDefined()
  uberCompetencies: string[];
}
