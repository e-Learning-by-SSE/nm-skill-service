import { IsNotEmpty } from "class-validator";
import { Job } from "@prisma/client";
import { JobCreationDto } from "./job-creation.dto";

export class JobDto extends JobCreationDto {
    @IsNotEmpty()
    id!: string;

    constructor(
        id: string,
        jobTitle: string,
        startTime: Date,
        endTime: Date,
        companyId: string,
        userId: string,
    ) {
        super(jobTitle, startTime, endTime, companyId, userId);
        this.id = id;
        this.jobTitle = jobTitle;
        this.startTime = startTime;
        this.endTime = endTime;
        this.companyId = companyId;
        this.userId = userId;
    }

    static createFromDao(jb: Job): JobCreationDto {
        return new JobDto(jb.id, jb.jobTitle, jb.startTime, jb.endTime, jb.companyId, jb.userId);
    }
}
