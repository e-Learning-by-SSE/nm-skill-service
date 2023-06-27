import { ApiProperty } from '@nestjs/swagger';
import { RoleCategory } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new User
 */
export class RoleGroupCreationDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  userId: string;
  
  constructor(
    name: string,
    userId: string
    ) {
    this.name = name;
    this.userId = userId  }
}
