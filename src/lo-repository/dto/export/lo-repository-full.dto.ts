import { ShallowLoRepositoryDto } from './lo-repository-shallow.dto';

/**
 * Represents a LO-Repository and its nested Learning Objects.
 */
export class LoRepositoryDto extends ShallowLoRepositoryDto {
  learningObjects: string[];

  constructor(id: string, name: string, owner: string, description?: string | null) {
    super(id, name, owner, description);
    this.learningObjects = <string[]>[];
  }
}
