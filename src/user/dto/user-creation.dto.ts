import { ApiProperty } from '@nestjs/swagger';
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
  learningBehavior?: string;
  @IsOptional()
  learningProgress?: string[];
  @IsOptional()
  learningHistory?: string;
  @IsOptional()
  status?: string;     // (active, inactive)  value set by User-Events (create / delete), default value is "active"
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
  * @param learningBehavior: The learningBehaviorId of the user
  * @param learningProgress: The Ids of learningProgress dtos of the user 
  * @param learningHistory: The LearningHistoryId of the user
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
    learningBehavior: string | null,
    learningProgress: string[] | null,
    learningHistory: string | null,
    status: string | null, 
    qualification: string[] | null,
    job: string | null,

    ) {
    this.id = id;  
    this.name = name ?? undefined;
    this.learningProfile = learningProfile ?? undefined;
    this.careerProfile = careerProfile ?? undefined;
    this.company = company ?? undefined;
    this.companyId = companyId ?? undefined;
    this.learningBehavior = learningBehavior ?? undefined;
    this.learningProgress = learningProgress ?? undefined;
    this.learningHistory = learningHistory ?? undefined;
    this.status = status ?? undefined;
    this.qualification = qualification ?? undefined;
    this.job = job ?? undefined;
  }
}

