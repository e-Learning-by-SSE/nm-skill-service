import { IsDefined, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';
import { Company } from '@prisma/client';
import { CompanyCreationDto } from './company-creation.dto';

export class CompanyDto extends CompanyCreationDto {
  @IsNotEmpty()
  id!: string;
  users: UserDto[];
  @IsDefined()
  name :string;

  constructor(
    id: string,
    name: string,
    
  ) {
    super(name);
    this.id = id;
  }

  static createFromDao(comp: Company): CompanyDto {
    return new CompanyDto(
      comp.id,
      comp.name
    );
  }
}
