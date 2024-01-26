import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new Job
 */
export class JobCreationDto {
  @IsNotEmpty()
  jobTitle: string;
  @IsNotEmpty()
  startTime: Date;
  @IsNotEmpty()
  endTime: Date;
  @IsNotEmpty()
  companyId:string;
  @IsOptional()
  userId:string;

  @IsOptional()
  jobIdAtBerufeNet? : string;

  constructor(jobTitle: string, startTime: Date, endTime: Date, companyId: string, userId: string, jobIdAtBerufeNet? :string) {
    this.jobTitle = jobTitle;   
    this.startTime = startTime;
    this.endTime = endTime;
    this.companyId = companyId;
    this.userId = userId;
    this.jobIdAtBerufeNet = jobIdAtBerufeNet ?? undefined;
  }
}