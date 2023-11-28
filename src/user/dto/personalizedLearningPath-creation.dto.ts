import { Skill, LearningUnit,LearningHistory, LearningPath, LearningPathProgress, LIFECYCLE } from '@prisma/client';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new PersonalizedLearningPath.
 */
export class PersonalizedLearningPathCreationDto {
  /**
   * Used to validate that the user is the owner of the target repository.
   */
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  pathTeachingGoals?: Skill[];

  @IsOptional()
  unitSequence?: LearningUnit[];

  @IsOptional()
  userProfil?: LearningHistory;
  
  @IsOptional()
  userProfilId? :string

  @IsOptional()
  learningPath? :LearningPath

  @IsOptional()
  learningPathId? :string

  @IsOptional()
  progress? :LearningPathProgress

  @IsOptional()
  lifecycle? :LIFECYCLE

  @IsDefined()
  id: string;

}
