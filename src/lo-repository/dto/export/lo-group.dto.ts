import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { GroupedLearningObjects, LearningObject } from '@prisma/client';

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

  constructor(
    id: string,
    repositoryId: string,
    name: string,
    description: string | null,
    nestedLOs: LearningObject[] | null,
    nestedGroups: GroupedLearningObjects[] | null,
  ) {
    this.id = id;
    this.repositoryId = repositoryId;
    this.name = name;
    this.description = description ?? undefined;
    this.nestedLearningObjects = nestedLOs?.map((lo) => LearningObjectDto.createFromDao(lo)) ?? [];
    this.nestedGroups = nestedGroups?.map((g) => LearningObjectGroupDto.createFromDao(g)) ?? [];
  }

  static createFromDao(
    dao: GroupedLearningObjects & {
      nestedLOs?: LearningObject[];
      nestedGroups?: GroupedLearningObjects[];
    },
  ) {
    return new LearningObjectGroupDto(
      dao.id,
      dao.loRepositoryId,
      dao.name,
      dao.description,
      dao.nestedLOs ?? null,
      dao.nestedGroups ?? null,
    );
  }
}
