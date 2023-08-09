import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new User
 */
export class UserCreationDto {
  @IsNotEmpty()
  name: string;
  
  @IsOptional()
  companyId?: string;
  
  constructor(
    name: string, compID: string | null, 
    ) {
    this.name = name;
    this.companyId = compID ?? undefined;  
  }
}
