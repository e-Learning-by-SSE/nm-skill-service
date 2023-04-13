import { IsNotEmpty } from 'class-validator';

import { Nugget, NuggetCategory } from '@prisma/client';

import { NuggetCreationDto } from './nugget-creation.dto';

export class NuggetDto extends NuggetCreationDto {
  @IsNotEmpty()
  id!: number;

  constructor(
    id: number,
    language: string,
    isTypeOf: NuggetCategory,
    processingTime: string,
    presenter?: string | null,
    mediatype?: string | null,
  ) {
    super(language, processingTime, isTypeOf, presenter, mediatype);
    this.id = id;
  }

  static createFromDao(nugget: Nugget): NuggetDto {
    return new NuggetDto(
      nugget.id,
      nugget.language,
      nugget.isTypeOf,
      nugget.processingTime,
      nugget.presenter,
      nugget.mediatype,
    );
  }
}
