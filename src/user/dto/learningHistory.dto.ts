import { IsDefined, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';
import { LearningHistory } from '@prisma/client';
import { LearningHistoryCreationDto } from './learningHistory-creation.dto';

export class LearningHistoryDto extends LearningHistoryCreationDto {
  @IsNotEmpty()
  id!: string;
  @IsDefined()
  userId :string;

  // workedAt   CareerProfile[] @relation("workedAt")
  // workingNow CareerProfile[] @relation("workingNow")

  constructor(
    id: string,
    userId: string,
    
  ) {
    super(userId);
    this.id = id;
  }

  static createFromDao(lh: LearningHistory): LearningHistoryCreationDto {
    return new LearningHistoryDto(
      lh.id,
      lh.userId
    );
  }
}