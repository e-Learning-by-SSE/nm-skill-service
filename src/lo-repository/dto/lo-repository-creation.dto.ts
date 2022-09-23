import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Request data to create a new LO repository.
 */
export class LoRepositoryCreationDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;
}
