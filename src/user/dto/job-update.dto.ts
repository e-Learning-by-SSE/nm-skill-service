import { IsOptional } from "class-validator";

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
    companyId: string;

    @IsOptional()
    jobIdAtBerufeNet?: string;

    constructor(
        jobTitle: string,
        startTime: Date,
        endTime: Date,
        companyId: string,
        userId: string,
        jobIdAtBerufeNet?: string,
    ) {
        this.jobTitle = jobTitle ?? undefined;
        this.startTime = startTime ?? undefined;
        this.endTime = endTime ?? undefined;
        this.companyId = companyId ?? undefined;

        this.jobIdAtBerufeNet = jobIdAtBerufeNet ?? undefined;
    }
}
