import { IsOptional } from 'class-validator';
import { LearningUnitCreationDto } from 'src/learningUnit/dto/learning-unit-creation.dto';

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

  constructor(
    language: string,
    title: string,
    description?: string | null,
    processingTime?: string | null,
    rating?: string | null,
    contentCreator?: string | null,
    contentProvider?: string | null,
    targetAudience?: string | null,
    semanticDensity?: string | null,
    semanticGravity?: string | null,
    contentTags?: string[] | null,
    contextTags?: string[] | null,
    linkToHelpMaterial?: string | null,
  ) {
    super(title, language, description);
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
  }
}
