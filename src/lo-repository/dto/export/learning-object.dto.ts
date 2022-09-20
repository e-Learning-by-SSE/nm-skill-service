import { IsNotEmpty, IsOptional } from 'class-validator';

import { Competence, LearningObject, UeberCompetence } from '@prisma/client';

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

  /**
   * Creates a new DTO based on the DAO created by prisma.
   * @param dao The data access object created by prisma
   * @returns A DTO instance representing the DAO
   */
  static createFromDao(
    dao: LearningObject & {
      requiredCompetencies?: Competence[];
      requiredUeberCompetencies?: UeberCompetence[];
      offeredCompetencies?: Competence[];
      offeredUeberCompetencies?: UeberCompetence[];
    },
  ) {
    const result = new LearningObjectDto(dao.id, dao.loRepositoryId, dao.name, dao.description);
    if (dao.requiredCompetencies) {
      dao.requiredCompetencies.map((r) => {
        result.requiredCompetencies.push(r.id);
      });
    }
    if (dao.requiredUeberCompetencies) {
      dao.requiredUeberCompetencies.map((r) => {
        result.requiredUeberCompetencies.push(r.id);
      });
    }
    if (dao.offeredCompetencies) {
      dao.offeredCompetencies.map((r) => {
        result.offeredCompetencies.push(r.id);
      });
    }
    if (dao.offeredCompetencies) {
      dao.offeredCompetencies.map((r) => {
        result.offeredUeberCompetencies.push(r.id);
      });
    }

    return result;
  }
}
