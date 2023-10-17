import { IsDefined, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';
import { Company } from '@prisma/client';
import { CareerProfile } from '@prisma/client';
import { Job } from '@prisma/client';
import { JobCreationDto } from './job-creation.dto';

export class JobDto extends JobCreationDto {
  @IsNotEmpty()
  id!: string;

  constructor(id: string,jobtitle: string, starttime : Date, endtime : Date, companyId: string, userId : string) {

    super(jobtitle,starttime,endtime,companyId,userId);
    this.id = id;
    this.jobtitle = jobtitle;
    this.starttime = starttime;
    this.endtime = endtime;
    this.companyId = companyId;
    this.userId = userId;
  }

  static createFromDao(jb: Job): JobCreationDto {
    return new JobDto(
      jb.id,
      jb.jobtitle,
      jb.starttime,
      jb.endtime,
      jb.companyId,
      jb.userId
    );
  }
}