import { IsDefined, IsNotEmpty } from 'class-validator';

import { LearningProfile, Skill, LearningHistory } from '@prisma/client';
import { OmitType } from '@nestjs/swagger';
import { CareerProfileCreationDto } from './careerProfile-creation.dto';
import { LearningProfileCreationDto } from './learningProfile-creation.dto';

export class LearningProfileDto extends LearningProfileCreationDto {
  @IsNotEmpty()
  id: string;

  

  constructor(id: string, semanticDensity: number | undefined, semanticGravity: number | undefined, mediaType: string | null, language: string | null, processingTPU: string | null, learningHistoryId: string | null, userId: string) {
    super();
    
    this.id = id;
    this.semanticDensity = semanticDensity ?? undefined;
    this.semanticGravity = semanticGravity ?? undefined;
    this.mediaType = mediaType ?? undefined;
    this.language = language ?? undefined;
    this.processingTimePerUnit = processingTPU ?? undefined;
    this.learningHistoryId   =    learningHistoryId ?? undefined;
    this.userId = userId;
  }

  /**
   * Creates a new SkillDto from a DB result, but won't consider parents/children.
   * @param skill The DB result which shall be converted to a DTO
   * @returns The corresponding DTO, but without parents/children
   */
  static createFromDao(lp: LearningProfile): LearningProfileCreationDto {
    return new LearningProfileDto(lp.id, lp.semanticDensity, lp.semanticGravity, lp.mediaType, lp.language,lp.processingTimePerUnit, lp.learningHistoryId, lp.userId);
  }
}
