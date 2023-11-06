import { IsDefined } from 'class-validator';

import { FeedbackDto } from './feedback.dto';

export class FeedbackListDto {
  @IsDefined()
  feedback: FeedbackDto[] = [];
}
