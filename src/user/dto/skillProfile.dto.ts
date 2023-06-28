import { IsDefined, IsNotEmpty } from 'class-validator';

import { Skill, SkillProfile } from '@prisma/client';


import { SkillProfileCreationDto } from './skillProfil-creation.dto';

export class SkillProfileDto extends SkillProfileCreationDto {
  @IsNotEmpty()
  id: string;

  @IsDefined()
  userId: string;

  constructor(id: string, jobHistory: string| null, professionalInterests: string | null, userId: string ) {
    super();
    this.id = id;
    this.jobHistory = jobHistory ?? undefined;
    this.professionalInterests = professionalInterests ?? undefined;
    this.userId = userId;
    
    
  }

  /**
   * Creates a new SkillProfileDto from a DB result
   * @param skill The DB result which shall be converted to a DTO
   * @returns The corresponding DTO
   */
  static createFromDao(skillProfile: SkillProfile): SkillProfileDto {
    return new SkillProfileDto(skillProfile.id, skillProfile.jobHistory, skillProfile.professionalInterests, skillProfile.userId);
  }
}
