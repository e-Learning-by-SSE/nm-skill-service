import { IsDefined } from 'class-validator';

import { LoRepository } from '@prisma/client';

import { LearningObjectDto } from './learning-object.dto';
import { LearningObjectGroupDto } from './lo-group.dto';
import { ShallowLoRepositoryDto } from './lo-repository-shallow.dto';

/**
 * Represents a LO-Repository and its nested Learning Objects.
 */
export class LoRepositoryDto extends ShallowLoRepositoryDto {
  @IsDefined()
  learningObjects!: LearningObjectDto[];

  @IsDefined()
  learningObjectsGroups!: LearningObjectGroupDto[];

  constructor(id: string, name: string, owner: string, description?: string | null) {
    super(id, name, owner, description);
    this.learningObjects = [];
    this.learningObjectsGroups = [];
  }

  static createFromDao(loRepository: LoRepository) {
    return new LoRepositoryDto(loRepository.id, loRepository.name, loRepository.userId, loRepository.description);
  }
}
