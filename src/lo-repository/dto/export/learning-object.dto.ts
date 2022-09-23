import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { Competence, LearningObject, UeberCompetence } from '@prisma/client';

export class LearningObjectDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  loRepositoryId!: string;

  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  requiredCompetencies!: string[];
  @IsDefined()
  requiredUeberCompetencies!: string[];
  @IsDefined()
  offeredCompetencies!: string[];
  @IsDefined()
  offeredUeberCompetencies!: string[];

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
    result.requiredCompetencies = dao.requiredCompetencies?.map((rc) => rc.id) ?? [];
    result.requiredUeberCompetencies = dao.requiredUeberCompetencies?.map((ruc) => ruc.id) ?? [];
    result.offeredCompetencies = dao.offeredCompetencies?.map((oc) => oc.id) ?? [];
    result.offeredUeberCompetencies = dao.offeredUeberCompetencies?.map((ouc) => ouc.id) ?? [];

    return result;
  }
}
