import { IsNotEmpty } from "class-validator";
import { CareerProfile, Job, Qualification, Skill } from "@prisma/client";
import { JobDto, QualificationDto } from "../../dto";

/**
 * Models a complete career profile
 */
export class CareerProfileDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    userId: string; //The user to which this career profile belongs
    jobHistory: JobDto[];
    professionalInterests: string;
    qualifications: QualificationDto[];
    selfReportedSkills: Skill[]; //Currently do not work with dtos here, as correct one is unclear
    verifiedSkills: Skill[]; //Currently do not work with dtos here, as correct one is unclear

    static createFromDao(
        cp: CareerProfile & {
            jobHistory: Job[];
            qualifications: Qualification[];
            selfReportedSkills: Skill[];
            verifiedSkills: Skill[];
        },
    ): CareerProfileDto {
        return {
            id: cp.id,
            userId: cp.userId,
            jobHistory: cp.jobHistory.map((job) => JobDto.createFromDao(job)),
            professionalInterests: cp.professionalInterests,
            qualifications: cp.qualifications.map((qualification) => QualificationDto.createFromDao(qualification)),
            selfReportedSkills: cp.selfReportedSkills,
            verifiedSkills: cp.selfReportedSkills,
        };
    }
}
