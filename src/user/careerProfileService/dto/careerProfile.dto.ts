import { IsArray, IsNotEmpty } from "class-validator";
import { CareerProfile, Job, Qualification } from "@prisma/client";
import { JobDto, QualificationDto } from "../../dto";

/**
 * Models a complete career profile
 */
export class CareerProfileDto {
    @IsNotEmpty()
    id: string; //Same as the user id to which it belongs
    @IsArray()
    jobHistory: JobDto[];
    @IsArray()
    professionalInterests: string[];
    @IsArray()
    qualifications: QualificationDto[];
    @IsArray()
    selfReportedSkills: string[];

    /**
     * Creates a new CareerProfileDto from a DB result
     * @param careerProfile The DB result (including child objects) which shall be converted to a DTO
     * @returns The corresponding DTO (including child objects as DTOs)
     */
    static createFromDao(
        careerProfile: CareerProfile & {
            jobHistory: Job[];
            qualifications: Qualification[];
        },
    ): CareerProfileDto {
        return {
            id: careerProfile.userId,
            jobHistory: careerProfile.jobHistory.map((job) => JobDto.createFromDao(job)),
            professionalInterests: careerProfile.professionalInterests,
            qualifications: careerProfile.qualifications.map((qualification) =>
                QualificationDto.createFromDao(qualification),
            ),
            selfReportedSkills: careerProfile.selfReportedSkills,
        };
    }
}
