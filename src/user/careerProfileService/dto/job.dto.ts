import { IsNotEmpty } from "class-validator";
import { Job } from "@prisma/client";

export class JobDto {
    @IsNotEmpty()
    id: string;
    jobTitle: string;
    startTime: Date;
    endTime: Date;
    companyId: string;
    jobIdAtBerufeNet?: string;
    careerProfileId: string;



    static createFromDao(jb: Job): JobDto {
        return {
            id: jb.id,
            jobTitle: jb.jobTitle,
            startTime: jb.startTime,
            endTime: jb.endTime,
            companyId: jb.companyId,
            jobIdAtBerufeNet: jb.jobIdAtBerufeNet ?? undefined,
            careerProfileId: jb.careerProfileId,
        }
    }
}
