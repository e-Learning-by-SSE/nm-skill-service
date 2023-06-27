import { IsDefined, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';
import { Company, RoleCategory, RoleGroup } from '@prisma/client';
import { RoleGroupCreationDto } from './roleGroup-creation.dto';

export class RoleGroupDto extends RoleGroupCreationDto {
  @IsNotEmpty()
  id!: string;
  @IsDefined()
  name: string;
  @IsNotEmpty()
  userId!: string;
  roles: RoleDto[];
  

  constructor(id: string, name: string, userId: string) {
    super(name, userId);
    this.id = id;
    this.name = name;
  }

  static createFromDao(role: RoleGroup): RoleGroupDto {
    return new RoleGroupDto(role.id, role.name, role.userId);
  }
}
export class RoleDto {
  @IsNotEmpty()
  id!: string;
  isTypeOf: RoleCategory;
  constructor(id: string, isTypeOf: RoleCategory) {
    this.id = id;
    this.isTypeOf = isTypeOf;
  }
}
