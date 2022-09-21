import { IsNotEmpty } from 'class-validator';

import { Competence, UeberCompetence } from '@prisma/client';

import { UeberCompetenceCreationDto } from '../ueber-competence-creation.dto';

export class UnResolvedUeberCompetenceDto extends UeberCompetenceCreationDto {
  @IsNotEmpty()
  id: string;

  parents: string[];
  nestedCompetencies: string[];
  nestedUeberCompetencies: string[];

  constructor(id: string, name: string, description?: string | null) {
    super(name, description);
    this.id = id;
    this.parents = [];
    this.nestedCompetencies = [];
    this.nestedUeberCompetencies = [];
  }

  static createFromDao(
    dao: UeberCompetence & {
      subCompetences?: Competence[];
      subUeberCompetences?: UeberCompetence[];
      parentUeberCompetences?: UeberCompetence[];
    },
  ) {
    const result = new UnResolvedUeberCompetenceDto(dao.id, dao.name, dao.description);

    if (dao.subCompetences) {
      dao.subCompetences.map((r) => {
        result.nestedCompetencies.push(r.id);
      });
    }
    if (dao.subUeberCompetences) {
      dao.subUeberCompetences.map((r) => {
        result.nestedUeberCompetencies.push(r.id);
      });
    }
    if (dao.parentUeberCompetences) {
      dao.parentUeberCompetences.map((r) => {
        result.parents.push(r.id);
      });
    }

    return result;
  }
}
