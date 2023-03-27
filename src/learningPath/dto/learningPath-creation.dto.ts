import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Creates a new LearningPath
 */
export class LearningPathCreationDto {

  @IsNotEmpty()
  titel!: string;

  @IsNotEmpty()
  tagetAudience!: string;
  

  @IsOptional()
  description?: string;
  
 

  constructor(titel: string, tagetAudience: string, description: string) {
    this.titel = titel;
    this.tagetAudience = tagetAudience;
    this.description = description;
    
  }
}
