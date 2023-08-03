import { IsDefined, IsOptional } from 'class-validator';
import { LearningUnitCreationDto } from '../learning-unit-creation.dto';

/**
 * Creates a new learningUnit
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class SearchLearningUnitCreationDto extends LearningUnitCreationDto {
  @IsOptional()
  processingTime?: string;

  @IsOptional()
  rating?: string;

  @IsOptional()
  contentCreator?: string;

  @IsOptional()
  contentProvider?: string;

  @IsOptional()
  targetAudience?: string;

  @IsOptional()
  semanticDensity?: string;

  @IsOptional()
  semanticGravity?: string;

  @IsOptional()
  contentTags?: string[];

  @IsOptional()
  contextTags?: string[];

  @IsOptional()
  linkToHelpMaterial?: string;

  @IsOptional()
  requiredSkills?: string[] = [];

  constructor(
    language: string,
    title: string,
    resource: string,
    description: string | null,
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
    requiredSkills : string[] | null
  ) {
    super(title, resource, language, description);
    this.processingTime = processingTime ?? undefined;
    this.rating = rating ?? undefined;
    this.contentCreator = contentCreator ?? undefined;
    this.contentProvider = contentProvider ?? undefined;
    this.targetAudience = targetAudience ?? undefined;
    this.semanticDensity = semanticDensity ?? undefined;
    this.semanticGravity = semanticGravity ?? undefined;
    this.contentTags = contentTags ?? undefined;
    this.contextTags = contextTags ?? undefined;
    this.linkToHelpMaterial = linkToHelpMaterial ?? undefined;
    this.requiredSkills = requiredSkills ?? undefined;
  }

  /**
   * Alternative, shorthand factory method to create testing objects.
   * Only mandatory properties that are used during test need to be defined.
   * @param params The properties to be set.
   * @returns An instance suitable for testing, where all unset values are treated as `null`.
   */
  static createForTesting(
    params: Pick<SearchLearningUnitCreationDto, 'title'> & Partial<SearchLearningUnitCreationDto>,
  ): SearchLearningUnitCreationDto {
    return new SearchLearningUnitCreationDto(
      params.language ?? 'en',
      params.title, // Mandatory
      params.resource ?? 'https://example.com/a-resource',
      params.description ?? null,
      params.processingTime ?? null,
      params.rating ?? null,
      params.contentCreator ?? null,
      params.contentProvider ?? null,
      params.targetAudience ?? null,
      params.semanticDensity ?? null,
      params.semanticGravity ?? null,
      params.contentTags ?? null,
      params.contextTags ?? null,
      params.linkToHelpMaterial ?? null,
      params.requiredSkills ?? null
    );
  }
}
