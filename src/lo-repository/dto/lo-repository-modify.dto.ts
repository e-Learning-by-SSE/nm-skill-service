import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Request data to create a new LO repository.
 */
export class LoRepositoryModifyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;
}
