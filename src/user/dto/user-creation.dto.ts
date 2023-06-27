import { ApiProperty } from '@nestjs/swagger';
import { RoleCategory } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new User
 */
export class UserCreationDto {
  @IsNotEmpty()
  name: string;

  
  constructor(
    name: string,
    ) {
    this.name = name;
  
  }
}
