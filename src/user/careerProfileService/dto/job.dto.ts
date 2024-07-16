import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, isDateString } from "class-validator";
import { Job } from "@prisma/client";

/**
 * Models a complete job (currently we use this DTO for creation/update/deletion)
 */
export class JobDto {
    @IsOptional()
    @IsString()
    id?: string;
    @IsString()
    @IsNotEmpty()
    jobTitle: string;
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;
    @IsDateString()
    @IsOptional()
    endDate?: Date;
    @IsString()
    @IsNotEmpty()
    company: string;

    /**
     * Creates a new JobDto from a DB result
     * @param jobDao The DB result which shall be converted to a DTO
     * @returns The corresponding DTO
     */
    static createFromDao(jobDao: Job): JobDto {
        return {
            id: jobDao.id,
            jobTitle: jobDao.jobTitle,
            startDate: jobDao.startTime,
            endDate: jobDao.endTime || undefined,
            company: jobDao.company,
        };
    }
}
