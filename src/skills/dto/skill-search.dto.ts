import { IsInt, IsOptional, Min } from 'class-validator';

export class SkillSearchDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  pageSize?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  level?: number;

  @IsOptional()
  skillMap?: string;
}
