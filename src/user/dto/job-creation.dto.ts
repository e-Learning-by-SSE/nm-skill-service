import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new Job
 */
export class JobCreationDto {
  @IsNotEmpty()
  jobtitle: string;
  @IsNotEmpty()
  starttime: Date;
  @IsNotEmpty()
  endtime: Date;
  @IsNotEmpty()
  companyId:string;
  @IsOptional()
  userId:string;

  @IsOptional()
  jobIdAtBerufeNet? : string;

  constructor(jobtitle: string, starttime: Date, endtime: Date, companyId: string, userId: string, jobIdAtBerufeNet? :string) {
    this.jobtitle = jobtitle;   
    this.starttime = starttime;
    this.endtime = endtime;
    this.companyId = companyId;
    this.userId = userId;
    this.jobIdAtBerufeNet = jobIdAtBerufeNet ?? undefined;
  }
}