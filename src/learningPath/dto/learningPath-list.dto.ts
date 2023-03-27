import { IsDefined } from 'class-validator';

import { LearningPathDto } from './learningPath.dto';

export class LearningPathListDto {
  @IsDefined()
  learningPaths: LearningPathDto[];
}
