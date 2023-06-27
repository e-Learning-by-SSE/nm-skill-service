import { IsNotEmpty } from 'class-validator';

import { Nugget, NuggetCategory } from '@prisma/client';

import { NuggetCreationDto } from './nugget-creation.dto';

export class NuggetDto extends NuggetCreationDto {
  @IsNotEmpty()
  id!: string;

  constructor(
    id: string,
    language: string,
    resource: string,
    isTypeOf: NuggetCategory,
    processingTime: string,
    presenter: string | null,
    mediatype: string | null,
  ) {
    super(language, resource, processingTime, isTypeOf, presenter, mediatype);
    this.id = id;
  }

  static createFromDao(nugget: Nugget): NuggetDto {
    return new NuggetDto(
      nugget.id,
      nugget.resource,
      nugget.language,
      nugget.isTypeOf,
      nugget.processingTime,
      nugget.presenter,
      nugget.mediatype,
    );
  }
}
