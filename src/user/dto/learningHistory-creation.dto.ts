import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new LearningHistory
 */
export class LearningHistoryCreationDto {
  @IsNotEmpty()
  userId: string;

  constructor(
    userId: string,
    ) {
    this.userId = userId;
  
  }
}

