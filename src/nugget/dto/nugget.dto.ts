import { IsNotEmpty } from 'class-validator';

import { Competence, Nugget } from '@prisma/client';

import { NuggetCreationDto } from './nugget-creation.dto';

export class NuggetDto extends NuggetCreationDto {
  @IsNotEmpty()
  id!: number;

  constructor(id: number,language: string, processingTime: number, presenter?: string | null, mediatype?: string | null) {
   
    super(language, processingTime, presenter, mediatype);
    this.id = id;
  }
 


  static createFromDao(nugget: Nugget): NuggetDto {
    return new NuggetDto(nugget.id, nugget.language!  ,Number( nugget.processingTime), nugget.presenter);
  }
}
