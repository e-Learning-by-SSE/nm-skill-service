import { IsOptional } from 'class-validator';
import { LearningUnitCreationDto } from '../learning-unit-creation.dto';

/**
 * Creates a new learningUnit
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 */
export class SelfLearnLearningUnitCreationDto extends LearningUnitCreationDto {
  @IsOptional()
  order?: number;

  constructor(language: string, title: string, description?: string | null, order?: number | null) {
    super(title, language, description);
    this.order = order ?? undefined;
  }

  /**
   * Alternative, shorthand factory method to create testing objects.
   * Only mandatory properties that are used during test need to be defined.
   * @param params The properties to be set.
   * @returns An instance suitable for testing, where all unset values are treated as `null`.
   */
  static createForTesting(
    params: Pick<SelfLearnLearningUnitCreationDto, 'title'> & Partial<SelfLearnLearningUnitCreationDto>,
  ): SelfLearnLearningUnitCreationDto {
    return new SelfLearnLearningUnitCreationDto(
      params.language ?? 'en',
      params.title, // Mandatory
      params.description ?? null,
      params.order ?? null,
    );
  }
}
