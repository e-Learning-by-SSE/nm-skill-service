import { IsNotEmpty } from 'class-validator';

import { Competence } from '@prisma/client';

import { CompetenceCreationDto } from '../competence-creation.dto';

export class CompetenceDto extends CompetenceCreationDto {
  @IsNotEmpty()
  id!: string;

  constructor(id: string, skill: string, level: number, description?: string | null) {
    super(skill, level, description);
    this.id = id;
  }

  static createFromDao(competence: Competence): CompetenceDto {
    return new CompetenceDto(competence.id, competence.skill, competence.level, competence.description);
  }
}
