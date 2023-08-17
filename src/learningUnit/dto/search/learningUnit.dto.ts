import { IsNotEmpty } from 'class-validator';

import { SearchLearningUnitCreationDto } from './learningUnit-creation.dto';
import { LearningUnit } from '@prisma/client';

export class SearchLearningUnitDto extends SearchLearningUnitCreationDto {
  @IsNotEmpty()
  searchId: string;

  constructor(
    id: string,
    title: string,
    ressource: string,
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
  ) {
    super(
      language,
      title,
      ressource,
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
    );
    this.searchId = id;
  }

  static createFromDao(unit: LearningUnit): SearchLearningUnitDto {
    return new SearchLearningUnitDto(
      unit.id,
      unit.title,
      unit.resource,
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
    );
  }
}
