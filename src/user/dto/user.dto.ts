import { IsNotEmpty } from 'class-validator';

import { User } from '@prisma/client';

import { UserCreationDto } from './user-creation.dto';

export class UserDto extends UserCreationDto {
  @IsNotEmpty()
  id: string;
  

  constructor(
    id: string,
    name: string,
    compId: string | null,
  ) {
    super(name,compId);
    this.id = id;
    this.name = name
  }

  static createFromDao(user: User): UserDto {
    return new UserDto(
      user.id,
      user.name, 
      user.companyId
    );
  }
}
