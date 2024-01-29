import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';


export class CareerProfileFilterDto {
  @IsOptional()
  @IsString()
  userId?: string;
}