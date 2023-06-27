import { ApiProperty } from '@nestjs/swagger';
import { RoleCategory } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new User
 */
export class UserCreationDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  companyId: string;
  
  constructor(
    name: string, compID: string
    ) {
    this.name = name;
    this.companyId = compID;  
  }
}
