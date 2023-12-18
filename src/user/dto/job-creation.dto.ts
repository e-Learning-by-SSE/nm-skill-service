import { IsNotEmpty, IsOptional, IsDefined } from "class-validator";
import { Company, CareerProfile, UserProfile } from "@prisma/client";

/**
 * Creates a new Job
 */
export class JobCreationDto {
    @IsDefined()
    id: string;

    @IsNotEmpty()
    jobtitle: string;

    @IsNotEmpty()
    starttime: Date;

    @IsNotEmpty()
    endtime: Date;

    @IsOptional()
    company?: Company;

    @IsNotEmpty()
    companyId: string;

    @IsOptional()
    userJobs?: CareerProfile[];

    user: UserProfile;

    @IsOptional()
    userId: string;

    @IsOptional()
    jobIdAtBerufeNet?: string;

    constructor(
        jobtitle: string,
        starttime: Date,
        endtime: Date,
        companyId: string,
        userId: string,
        jobIdAtBerufeNet?: string,
    ) {
        this.jobtitle = jobtitle;
        this.starttime = starttime;
        this.endtime = endtime;
        this.companyId = companyId;
        this.userId = userId;
        this.jobIdAtBerufeNet = jobIdAtBerufeNet ?? undefined;
    }
}
