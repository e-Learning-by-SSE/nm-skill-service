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
}
