import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Represents a LO-Repository, but doesn't list its nested Learning Objects.
 */
export class ShallowLoRepositoryDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner: string;

  @IsOptional()
  description?: string;

  constructor(id: string, name: string, owner: string, description?: string | null) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.description = description ?? undefined;
  }
}
