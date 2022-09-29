import { IsInt, IsOptional, Min } from 'class-validator';

export class RepositorySearchDto {
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
}
