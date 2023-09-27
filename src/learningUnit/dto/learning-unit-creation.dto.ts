import { IsDefined, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new LearningUnit (Basic implementation for all extensions).
 * A LearningUnit represents a Nano-Module in the context of Self-Learn.
 *
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class LearningUnitCreationDto {
  @IsNotEmpty()
  id: string;
  @IsOptional()
  title?: string;

  /**
   * Should point to a resource (e.g. a website) which contains the learning unit.
   */
  

  @IsOptional()
  language?: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  teachingGoals: string[] = [];

  @IsDefined()
  requiredSkills: string[] = [];

  constructor(id: string, title?: string | null, language?: string | null, description?: string | null) {
    this.id  = id; 
    this.title = title ?? undefined;
    this.language = language ?? undefined;
    this.description = description ?? undefined;
  }
}
