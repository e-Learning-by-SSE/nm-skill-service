import { IsDefined, IsNotEmpty } from 'class-validator';

import { LearningProfile, Skill, Job, Qualification } from '@prisma/client';
import { OmitType } from '@nestjs/swagger';
import { CareerProfileCreationDto } from './careerProfile-creation.dto';
import { LearningProfileCreationDto } from './learningProfile-creation.dto';
import { CareerProfile } from '@prisma/client';

export class CareerProfileDto extends CareerProfileCreationDto {
  @IsNotEmpty()
  id: string;

  

  constructor(id: string, professionalInterests: string, currentCompanyId: string, userId: string) {
    super();
    
    this.id = id;
    this.professionalInterests = professionalInterests;
    this.currentCompanyId = currentCompanyId;
    this.userId = userId;
  }

  /**
   * Creates a new SkillDto from a DB result, but won't consider parents/children.
   * @param skill The DB result which shall be converted to a DTO
   * @returns The corresponding DTO, but without parents/children
   */
  static createFromDao(cp: CareerProfile): CareerProfileCreationDto {
    return new CareerProfileDto(cp.id, cp.professionalInterests, cp.currentCompanyId, cp.userId);
  }
}