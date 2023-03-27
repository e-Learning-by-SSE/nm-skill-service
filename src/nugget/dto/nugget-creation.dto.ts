import { ApiProperty } from '@nestjs/swagger';
import { NuggetCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Nugget
 */
export class NuggetCreationDto {

  @IsNotEmpty()
  language!: string;

  @IsNotEmpty()
  processingTime!: string;
  @ApiProperty({
    enum: NuggetCategory,
    isArray: true,
    example: [NuggetCategory.ANALYZE , NuggetCategory.CONTENT, NuggetCategory.EXAMPLE, NuggetCategory.EXERCISE, NuggetCategory.INTRODUCTION, NuggetCategory.TEST],
})
  @IsNotEmpty()
  istypeof :NuggetCategory;

  @IsOptional()
  presenter?: string;
  
  @IsOptional()
  mediatype?: string;

  constructor(language: string, processingTime: string, isTypeof: string, presenter?: string | null, mediatype?: string | null) {
    this.language = language;
    this.processingTime = processingTime;
   // has to be adapted
    this.istypeof = NuggetCategory['ANALYZE']
    this.presenter = presenter ?? undefined;
    this.mediatype = mediatype ?? undefined;
    
  }
}
