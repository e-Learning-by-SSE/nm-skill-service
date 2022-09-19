import { IsNotEmpty, IsOptional } from 'class-validator';

export class LearningObjectDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  loRepositoryId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  requiredCompetencies: string[];
  requiredUeberCompetencies: string[];
  offeredCompetencies: string[];
  offeredUeberCompetencies: string[];

  constructor(id: string, loRepositoryId: string, name: string, description?: string | null) {
    this.id = id;
    this.loRepositoryId = loRepositoryId;
    this.name = name;
    this.description = description ?? undefined;
    this.requiredCompetencies = [];
    this.requiredUeberCompetencies = [];
    this.offeredCompetencies = [];
    this.offeredUeberCompetencies = [];
  }
}
