import { IsNotEmpty } from "class-validator";
import { CareerProfile, Job, Qualification, Skill } from "@prisma/client";
import { JobDto, QualificationDto } from "../../dto";

/**
 * Models a complete career profile
 */
export class CareerProfileDto {
    @IsNotEmpty()
    id: string; //Same as the user id to which it belongs
    jobHistory: JobDto[];
    professionalInterests: string[];
    qualifications: QualificationDto[];
    selfReportedSkills: string[]; 

    //TODO: Unfinished
    static createFromDao(
        cp: CareerProfile & {
            jobHistory: Job[];
            qualifications: Qualification[];
            selfReportedSkills: Skill[];
        },
    ): CareerProfileDto {
        return {
            id: cp.userId,
            jobHistory: cp.jobHistory.map((job) => JobDto.createFromDao(job)),
            professionalInterests: cp.professionalInterests,
            qualifications: cp.qualifications.map((qualification) => QualificationDto.createFromDao(qualification)),
            selfReportedSkills: cp.selfReportedSkills,
        };
    }
}
