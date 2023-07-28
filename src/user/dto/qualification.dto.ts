import { IsDefined, IsNotEmpty } from 'class-validator';

import { Qualification, SkillProfile } from '@prisma/client';

import { QualificationCreationDto } from './qualification-creation.dto';

export class QualificationDto extends QualificationCreationDto {
  @IsNotEmpty()
  id: string;

  @IsDefined()
  userId: string;

  constructor(id: string, name: string, year: number, userId: string ) {
    super();
    this.id = id;
    this.name = name;
    this.year = year;
    this.userId = userId;
  }

  /**
   * Creates a new QualificationDto from a DB result
   * @param skilqualification The DB result which shall be converted to a DTO
   * @returns The corresponding DTO
   */
  static createFromDao(qualification: Qualification): QualificationDto {
    return new QualificationDto(qualification.id, qualification.name, qualification.year, qualification.userId);
  }
}
