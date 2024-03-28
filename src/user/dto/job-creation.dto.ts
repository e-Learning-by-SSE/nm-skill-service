import { IsNotEmpty, IsOptional } from "class-validator";

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
    companyId: string;
    @IsOptional()
    userId: string;

    @IsOptional()
    jobIdAtBerufeNet?: string;


}
