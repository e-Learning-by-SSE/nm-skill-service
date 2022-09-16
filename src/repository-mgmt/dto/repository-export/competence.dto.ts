import { IsNotEmpty } from 'class-validator';

import { CompetenceCreationDto } from '../competence-creation.dto';

export class CompetenceDto extends CompetenceCreationDto {
  @IsNotEmpty()
  id: string;

  static create(id: string, skill: string, level: number, description?: string | null): CompetenceDto {
    return {
      id: id,
      skill: skill,
      level: level,
      description: description ?? undefined,
    };
  }
}
