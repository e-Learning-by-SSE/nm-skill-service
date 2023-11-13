import { IsNotEmpty } from 'class-validator';

import { SearchLearningUnitCreationDto } from './learningUnit-creation.dto';
import { LIFECYCLE, LearningUnit } from '@prisma/client';

export class SearchLearningUnitDto extends SearchLearningUnitCreationDto {
 
  constructor(
    id: string,
    title: string,
    
    language: string,
    description: string,
    processingTime: string | null,
    rating: string | null,
    contentCreator: string | null,
    contentProvider: string | null,
    targetAudience: string | null,
    semanticDensity: string | null,
    semanticGravity: string | null,
    contentTags: string[] | null,
    contextTags: string[] | null,
    linkToHelpMaterial: string | null,
    lifecycle : LIFECYCLE,
    orga_id : string | null,
  ) {
    super(id,
      language,
      title,
      
      description,
      processingTime,
      rating,
      contentCreator,
      contentProvider,
      targetAudience,
      semanticDensity,
      semanticGravity,
      contentTags,
      contextTags,
      linkToHelpMaterial,
      lifecycle,
      orga_id,
    );
   
  }

  static createFromDao(unit: LearningUnit): SearchLearningUnitDto {
    return new SearchLearningUnitDto(
      unit.id,
      unit.title,
      unit.language,
      unit.description,
      unit.processingTime,
      unit.rating,
      unit.contentCreator,
      unit.contentProvider,
      unit.targetAudience,
      unit.semanticDensity,
      unit.semanticGravity,
      unit.contentTags,
      unit.contextTags,
      unit.linkToHelpMaterial,
      unit.lifecycle,
      unit.orga_id,
    );
  }
}
