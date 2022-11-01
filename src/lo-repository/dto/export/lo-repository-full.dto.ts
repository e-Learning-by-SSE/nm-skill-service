import { IsDefined } from 'class-validator';

import { LoRepository } from '@prisma/client';

import { LearningObjectDto, LearningObjectGroupDto, LoGoalDto, ShallowLoRepositoryDto } from './';

/**
 * Represents a LO-Repository and its nested Learning Objects.
 */
export class LoRepositoryDto extends ShallowLoRepositoryDto {
  @IsDefined()
  learningObjects!: LearningObjectDto[];

  @IsDefined()
  learningObjectsGroups!: LearningObjectGroupDto[];

  @IsDefined()
  goals: LoGoalDto[];

  constructor(id: string, name: string, owner: string, description?: string | null) {
    super(id, name, owner, description);
    this.learningObjects = [];
    this.learningObjectsGroups = [];
    this.goals = [];
  }

  static createFromDao(loRepository: LoRepository) {
    return new LoRepositoryDto(loRepository.id, loRepository.name, loRepository.userId, loRepository.description);
  }
}
