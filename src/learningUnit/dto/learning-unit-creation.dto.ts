import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new LearningUnit (Basic implementation for all extensions).
 * A LearningUnit represents a Nano-Module in the context of Self-Learn.
 *
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class LearningUnitCreationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  language: string;

  @IsOptional()
  description?: string;

  constructor(title: string, language: string, description?: string | null) {
    this.title = title;
    this.language = language;
    this.description = description ?? undefined;
  }
}
