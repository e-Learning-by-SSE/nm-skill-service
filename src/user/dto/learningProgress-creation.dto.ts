import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLearningProgressDto {
    @IsDefined() skillId: string; // The ID of the skill for which learning progress is being recorded

  }
  