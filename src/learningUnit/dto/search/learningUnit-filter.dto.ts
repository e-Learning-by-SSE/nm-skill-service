import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';


export class LearningUnitFilterDto {
  @IsOptional()
  @IsString()
  processingTime?: string;

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  contentCreator?: string;

  @IsOptional()
  @IsString()
  contentProvider?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsString()
  semanticDensity?: string;

  @IsOptional()
  @IsString()
  semanticGravity?: string;
  
  @IsOptional()
  @IsArray()
  contentTags?: string[];

  @IsOptional()
  @IsArray()
  contextTags?: string[];


  @IsOptional()
  @IsString()
  linkToHelpMaterial?: string;
  
  @IsOptional()
  @IsString()
  lifecycle?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  requiredSkills?: string[];
}
