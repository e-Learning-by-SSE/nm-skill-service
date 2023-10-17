import { IsDefined, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';
import { JobDto } from './job.dto';
import { Company } from '@prisma/client';
import { CareerProfile } from '@prisma/client';
import { CompanyCreationDto } from './company-creation.dto';

export class CompanyDto extends CompanyCreationDto {
  @IsNotEmpty()
  id!: string;
  users: UserDto[];
  @IsDefined()
  name :string;
  
  jobs: JobDto[];

  // workedAt   CareerProfile[] @relation("workedAt")
  // workingNow CareerProfile[] @relation("workingNow")


  constructor(
    id: string,
    name: string,
    
  ) {
    super(name);
    this.id = id;
  }

  static createFromDao(comp: Company): CompanyCreationDto {
    return new CompanyDto(
      comp.id,
      comp.name
    );
  }
}
