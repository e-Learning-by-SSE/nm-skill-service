import { IsInt, IsOptional, Min } from 'class-validator';

export class SkillRepositorySearchDto {
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
  version?: string;

  @IsOptional()
  owner?: string;
}
