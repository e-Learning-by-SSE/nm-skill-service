import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { LoRepository } from '@prisma/client';

import { LoGoalDto } from './';

export class LoGoalListDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  goals: LoGoalDto[];

  constructor(id: string, name: string, owner: string, description?: string | null) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.description = description ?? undefined;
    this.goals = [];
  }

  static createFromDao(repository: LoRepository) {
    return new LoGoalListDto(repository.id, repository.name, repository.userId, repository.description);
  }
}
