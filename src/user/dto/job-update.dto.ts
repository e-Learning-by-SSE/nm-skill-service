import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new Job
 */
export class JobUpdateDto {
 @IsOptional()
  jobtitle: string;
  @IsOptional()
  starttime: Date;
  @IsOptional()
  endtime: Date;
  @IsOptional()
  companyId:string;
  

  @IsOptional()
  jobIdAtBerufeNet? : string;

  constructor(jobtitle: string, starttime: Date, endtime: Date, companyId: string, userId: string, jobIdAtBerufeNet? :string) {
    this.jobtitle = jobtitle ?? undefined;   
    this.starttime = starttime ?? undefined;
    this.endtime = endtime ?? undefined;
    this.companyId = companyId   ?? undefined;
    
    this.jobIdAtBerufeNet = jobIdAtBerufeNet ?? undefined;
  }
}