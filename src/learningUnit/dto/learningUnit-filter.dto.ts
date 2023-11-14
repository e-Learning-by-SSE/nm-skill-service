import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';


export class LearningUnitFilterDto {
 
  @ApiProperty({ required: false, type: [String], description: 'Filter by required skills' })
  @IsOptional()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiProperty({ required: false, type: [String], description: 'Filter by required teachingGoals' })
  @IsOptional()
  @IsString({ each: true })
  teachingGoals?: string[];

  @ApiProperty({ required: false, type: [String], description: 'Filter by owners' })
  @IsOptional()
  @IsString({ each: true })
  owners?: string[];

}