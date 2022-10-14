import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class LoGoalCreationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  competencies: string[];

  @IsDefined()
  uberCompetencies: string[];
}
