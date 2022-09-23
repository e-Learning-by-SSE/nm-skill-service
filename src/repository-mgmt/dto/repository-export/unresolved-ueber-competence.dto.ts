import { IsDefined, IsNotEmpty } from 'class-validator';

import { Competence, UeberCompetence } from '@prisma/client';

import { UeberCompetenceCreationDto } from '../ueber-competence-creation.dto';

export class UnResolvedUeberCompetenceDto extends UeberCompetenceCreationDto {
  @IsNotEmpty()
  id!: string;

  @IsDefined()
  parents!: string[];
  @IsDefined()
  nestedCompetencies!: string[];
  @IsDefined()
  nestedUeberCompetencies!: string[];

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
    result.nestedCompetencies = dao.subCompetences?.map((c) => c.id) ?? [];
    result.nestedUeberCompetencies = dao.subUeberCompetences?.map((uc) => uc.id) ?? [];
    result.parents = dao.parentUeberCompetences?.map((p) => p.id) ?? [];

    return result;
  }
}
