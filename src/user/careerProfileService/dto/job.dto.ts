import { IsNotEmpty } from "class-validator";
import { Job } from "@prisma/client";

export class JobDto {
    @IsNotEmpty()
    id: string;
    jobTitle: string;
    startDate: Date;
    endDate: Date | null;
    company: string;


    static createFromDao(jb: Job): JobDto {
        return {
            id: jb.id,
            jobTitle: jb.jobTitle,
            startDate: jb.startTime,
            endDate: jb.endTime,
            company: jb.company,
        }
    }
}
