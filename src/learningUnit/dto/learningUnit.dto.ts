import { IsNotEmpty } from 'class-validator';

import { LearningUnit } from '@prisma/client';

import { LearningUnitCreationDto } from './learningUnit-creation.dto';

export class LearningUnitDto extends LearningUnitCreationDto {
  @IsNotEmpty()
  id!: number;

  constructor(
    id: number,
    language: string,
    processingTime: string,
    presenter?: string | null,
    mediatype?: string | null,
  ) {
    super(language, processingTime, presenter!, mediatype);
    this.id = id;
  }

  static createFromDao(unit: LearningUnit): LearningUnitDto {
    return new LearningUnitDto(unit.id, unit.language!, unit.processingTime);
  }
}
