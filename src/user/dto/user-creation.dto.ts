import { ApiProperty } from '@nestjs/swagger';
import { USERSTATUS } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * Creates a new User (UserProfile)
 * @author Christian Sauer <sauer@sse.uni-hildesheim.de>
 */

export class UserCreationDto {

  @IsNotEmpty()
  id: string;
  @IsOptional()
  name?: string;
  @IsOptional()
  learningProfile?: string;
  @IsOptional()
  careerProfile?: string;    
  @IsOptional()
  company?: string;             
  @IsOptional()
  companyId?: string;

  @IsOptional()
  status?: USERSTATUS;     // (active, inactive)  value set by User-Events (create / delete), default value is "active"
  @IsOptional()
  qualification?: string[];
  @IsOptional()
  job?: string;  
  
  /**
  * Constructor for a UserProfile object.
  * @param id The unique id of the user
  * @param name: The name of the user, optional
  * @param learningProfile: The learningProfileId of the user
  * @param careerProfile: The careerProfileId of the user    
  * @param company: The name of the company the user currently works in, is affiliated with            
  * @param companyId: The companyId of the company the user currently works in, is affiliated with
  * @param status: The status of the user, "active" or "inactive"
  * @param qualification: The Ids of qualification dtos of the user 
  * @param job: The jobId of the users current job
  */
  constructor(
    id:string,
    name: string | null,
    learningProfile: string | null,
    careerProfile: string | null,
    company: string | null,    
    companyId: string | null,
    status: USERSTATUS | null, 
    qualification: string[] | null,
    job: string | null,

    ) {
    this.id = id;  
    this.name = name ?? undefined;
    this.learningProfile = learningProfile ?? undefined;
    this.careerProfile = careerProfile ?? undefined;
    this.company = company ?? undefined;
    this.companyId = companyId ?? undefined;
  
    this.status = status ?? undefined;
    this.qualification = qualification ?? undefined;
    this.job = job ?? undefined;
  }
}

