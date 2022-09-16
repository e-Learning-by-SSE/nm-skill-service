import { IsNotEmpty } from 'class-validator';

import { RepositorySelectionDto } from '../repository-selection.dto';

export class RepositoryDto extends RepositorySelectionDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  id: string;

  taxonomy?: string;
  description?: string;

  static create(
    id: string,
    userId: string,
    name: string,
    version: string,
    taxonomy?: string | null,
    description?: string | null,
  ): RepositoryDto {
    return {
      id: id,
      userId: userId,
      name: name,
      version: version,
      taxonomy: taxonomy ?? undefined,
      description: description ?? undefined,
    };
  }
}
