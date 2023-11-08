import { IsNotEmpty } from "class-validator";

import { UserProfile } from "@prisma/client";

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
        status: string | null, 
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
            learningBehavior,
            learningProgress,
            learningHistory,
            status,
            qualification,
            job,
            );
        //this.id = id;
    }

    static createFromDao(user: UserProfile): UserDto {
        return new UserDto(
            user.id, 
            user.name, 
            user.learningProfile,
            user.careerProfile, 
            user.company, 
            user.companyId, 
            user.learningBehavior,
            user.learningProgress,
            user.learningHistory,
            user.status,
            user.qualification,
            user.job
            
    }
}

