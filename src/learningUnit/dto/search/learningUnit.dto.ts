import { IsDefined, IsNotEmpty } from 'class-validator';

import { SearchLUDaoType } from '../../types';
import { SearchLearningUnitCreationDto } from './learningUnit-creation.dto';

export class SearchLearningUnitDto extends SearchLearningUnitCreationDto {
  @IsNotEmpty()
  searchId: number;

  constructor(
    id: number,
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
  ) {
    super(
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
    );
    this.searchId = id;
  }

  static createFromDao(unit: SearchLUDaoType): SearchLearningUnitDto {
    return new SearchLearningUnitDto(
      unit.id,
      unit.title,
      unit.language,
      unit.description,
      unit.searchInfos?.processingTime,
      unit.searchInfos.rating,
      unit.searchInfos.contentCreator,
      unit.searchInfos.contentProvider,
      unit.searchInfos.targetAudience,
      unit.searchInfos.semanticDensity,
      unit.searchInfos.semanticGravity,
      unit.searchInfos.contentTags,
      unit.searchInfos.contextTags,
      unit.searchInfos.linkToHelpMaterial,
    );
  }
}
