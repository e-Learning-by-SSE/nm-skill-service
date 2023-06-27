import { IsNotEmpty } from 'class-validator';

import { User, RoleCategory } from '@prisma/client';

import { UserCreationDto } from './user-creation.dto';

export class UserDto extends UserCreationDto {
  @IsNotEmpty()
  id!: string;

  constructor(
    id: string,
    name: string,
 
  ) {
    super(name);
    this.id = id;
  }

  static createFromDao(user: User): UserDto {
    return new UserDto(
      user.id,
      user.name
    );
  }
}
