import { IsNotEmpty } from "class-validator";

import { CareerProfile, Company, Job, LearningBehaviorData, LearningHistory, LearningProfile, LearningProgress, Qualification, USERSTATUS, UserProfile } from "@prisma/client";

import { UserCreationDto } from "./user-creation.dto";

export class UserDto extends UserCreationDto {
    @IsNotEmpty()
    id: string;
    
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
        status: USERSTATUS | null, 
        qualification: string[] | null,
        job: string | null,
        ) 
        {
        super(
            id,
            name, 
            learningProfile,
            careerProfile, 
            company, 
            companyId, 
            
            status,
            qualification,
            job,
            );
        //this.id = id;
    }
    static createFromDao(user: UserProfile,learningProfile?:LearningProfile,  careerProfile?: CareerProfile, company?: Company, learningBehavior?:LearningBehaviorData, learningProgress?: LearningProgress[], learningHistory?: LearningHistory, qualification?:Qualification[], job?: Job): UserDto {
        const learningProgressAsArrayOfIds = learningProgress?.map((element) => element.id) || [];
        const qualificationAsArrayOfIds = qualification?.map((element) => element.id) || [];
        const learningProfileId = learningProfile?.id || '';
        const careerProfileId = careerProfile?.id || '';
        const companyName = company?.id || '';
        const learningBehaviorId = learningBehavior?.id || '';
        const learningHistoryId = learningHistory?.id || '';
        const jobId = job?.id || '';

        return new UserDto(
            user.id, 
            user.name, 
            learningProfileId,
            careerProfileId, 
            companyName, 
            user.companyId, 
            learningBehaviorId,
            learningProgressAsArrayOfIds,
            learningHistoryId,
            user.status,
            qualificationAsArrayOfIds,
            jobId,
        );
    }
}

