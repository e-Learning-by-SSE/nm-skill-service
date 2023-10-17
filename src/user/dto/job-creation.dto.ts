import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new Job
 */
export class JobCreationDto {
  @IsNotEmpty()
  jobtitle: string;
  starttime: Date;
  endtime: Date;
  companyId:string;
  userId:string;

  constructor(jobtitle: string, starttime: Date, endtime: Date, companyId: string, userId: string) {
    this.jobtitle = jobtitle;   
    this.starttime = starttime;
    this.endtime = endtime;
    this.companyId = companyId;
    this.userId = userId;
  
  }
}