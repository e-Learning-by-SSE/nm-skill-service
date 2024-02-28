import { Job, Qualification } from "@prisma/client";
import { IsDefined, IsOptional } from "class-validator";

/**
 * Creates a new CareerProfile
 * @author Christian Sauer <sauer@sse.uni-hildesheim.de>
 *
 */
export class CareerProfileCreationDto {
    /**
     * Used to validate that the user is the owner of the target repository.
     */
    @IsOptional()
    currentCompanyId?: string;
    @IsOptional()
    currentJobIdAtBerufeNet?: string;

    @IsDefined()
    professionalInterests: string;

    @IsDefined()
    userId: string;

    @IsOptional()
    selfReportedSkills: string[] = [];

    @IsOptional()
    verifiedSkills: string[] = [];

    @IsOptional()
    jobHistory: Job[] = [];

    @IsOptional()
    qualifications: Qualification[] = [];
}
