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

}
