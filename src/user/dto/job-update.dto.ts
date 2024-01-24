import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new Job
 */
export class JobUpdateDto {
 @IsOptional()
  jobTitle: string;
  @IsOptional()
  startTime: Date;
  @IsOptional()
  endTime: Date;
  @IsOptional()
  companyId:string;
  

  @IsOptional()
  jobIdAtJobsNet? : string;

  constructor(jobTitle: string, startTime: Date, endTime: Date, companyId: string, userId: string, jobIdAtJobsNet? :string) {
    this.jobTitle = jobTitle ?? undefined;   
    this.startTime = startTime ?? undefined;
    this.endTime = endTime ?? undefined;
    this.companyId = companyId   ?? undefined;
    
    this.jobIdAtJobsNet = jobIdAtJobsNet ?? undefined;
  }
}