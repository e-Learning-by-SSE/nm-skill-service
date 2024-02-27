import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { CareerProfileCreationDto } from './careerProfile-creation.dto';
import { LearningProfileCreationDto } from '../../learningProfileService/dto/learningProfile-creation.dto';
import { CareerProfile } from '@prisma/client';

export class CareerProfileDto extends CareerProfileCreationDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  description?: string;
  

  constructor(id: string, professionalInterests: string, userId: string, currentCompanyId?: string | null, currentJobIdAtBerufeNet?: string | null) {
    super();
    
    this.id = id;
    this.professionalInterests = professionalInterests;
    this.currentCompanyId = currentCompanyId ?? undefined;
    this.currentJobIdAtBerufeNet = currentJobIdAtBerufeNet ?? undefined;
    this.userId = userId;
  }

  /**
   * Creates a new SkillDto from a DB result, but won't consider parents/children.
   * @param skill The DB result which shall be converted to a DTO
   * @returns The corresponding DTO, but without parents/children
   */
  static createFromDao(cp: CareerProfile): CareerProfileDto {
    return new CareerProfileDto(cp.id, cp.professionalInterests, cp.userId, cp.currentCompanyId, cp.currentJobIdAtBerufeNet);
  }
}