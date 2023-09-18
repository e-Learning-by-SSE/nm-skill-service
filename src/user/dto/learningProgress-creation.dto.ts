import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLearningProgressDto {
    @IsDefined() skillId: string; // The ID of the skill for which learning progress is being recorded
    // You can include additional fields as needed, such as progress percentage, notes, etc.
  }
  