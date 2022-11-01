import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { GroupedLearningObjects } from '@prisma/client';

import { LearningObjectDto } from './learning-object.dto';

/**
 * Groups a set of Learning Objects that belong together.
 */
export class LearningObjectGroupDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  repositoryId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  nestedLearningObjects: LearningObjectDto[];

  @IsDefined()
  nestedGroups: LearningObjectGroupDto[];

  constructor(id: string, repositoryId: string, name: string, description: string | null) {
    this.id = id;
    this.repositoryId = repositoryId;
    this.name = name;
    this.description = description ?? undefined;
    this.nestedLearningObjects = [];
    this.nestedGroups = [];
  }

  static createFromDao(dao: GroupedLearningObjects) {
    return new LearningObjectGroupDto(dao.id, dao.loRepositoryId, dao.name, dao.description);
  }
}
