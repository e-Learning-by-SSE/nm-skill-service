import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new Nugget
 */
export class NuggetCreationDto {
  @IsNotEmpty()
  language!: string;

  @IsNotEmpty()
  processingTime!: number;

  @IsNotEmpty()
  isTypeof :String

  @IsOptional()
  presenter?: string;
  
  @IsOptional()
  mediatype?: string;

  constructor(language: string, processingTime: number, isTypeof: string, presenter?: string | null, mediatype?: string | null) {
    this.language = language;
    this.processingTime = processingTime;
    this.isTypeof = isTypeof;
    this.presenter = presenter ?? undefined;
    this.mediatype = mediatype ?? undefined;
    
  }
}
