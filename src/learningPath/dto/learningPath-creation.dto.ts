import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new LearningPath
 */
export class LearningPathCreationDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  targetAudience!: string;

  @IsOptional()
  description?: string;

  constructor(title: string, targetAudience: string, description: string) {
    this.title = title;
    this.targetAudience = targetAudience;
    this.description = description;
  }
}
