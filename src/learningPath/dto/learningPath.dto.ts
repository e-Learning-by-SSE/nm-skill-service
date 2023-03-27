import { IsNotEmpty } from 'class-validator';

import { LearningPath } from '@prisma/client';

import { LearningPathCreationDto } from './learningPath-creation.dto';

export class LearningPathDto extends LearningPathCreationDto {
  @IsNotEmpty()
  id!: number;

  constructor(id: number,title: string, targetAudience: string, description?: string | null) {
   
    super(title, targetAudience, description??'');
    this.id = id;
  }
 


  static createFromDao(lp: LearningPath): LearningPathDto {
    return new LearningPathDto(Number(lp.id), lp.title  ,lp.tagetAudience, lp.description);
  }
}
