import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { CareerProfile, UserProfile, Skill, Company, Job, Qualification } from "@prisma/client";

export class CareerProfileDto {
    @IsNotEmpty()
    id: string;
    @IsDefined()
    userId?: string;
    @IsOptional()
    user?: UserProfile;
    @IsOptional()
    jobHistory?: string[]; //// ConsumedUnitData
    @IsOptional()
    professionalInterests?: string;
    @IsOptional()
    qualifications?: string[];
    @IsOptional()
    selfReportedSkills?: string[];
    @IsOptional()
    verifiedSkills?: string[];
    @IsOptional()
    pastCompanies?: string[];
    @IsOptional()
    currentCompany?: string;
    @IsOptional()
    currentCompanyId?: string;
    @IsOptional()
    currentJobIdAtBerufeNet?: string;

    constructor(
        id: string,
        userId: string,
        user?: UserProfile | null,
        jobHistory?: string[] | null,
        professionalInterests?: string | null,
        qualifications?: string[] | null,
        selfReportedSkills?: string[] | null,
        verifiedSkills?: string[] | null,
        pastCompanies?: string[] | null,
        currentCompany?: string | null,
        currentCompanyId?: string | null,
        currentJobIdAtBerufeNet?: string | null,
    ) {
        this.id = id;
        this.userId = userId;
        this.user = user ?? undefined;
        this.jobHistory = jobHistory ?? undefined;
        this.professionalInterests = professionalInterests ?? undefined;
        this.qualifications = qualifications ?? undefined;
        this.selfReportedSkills = selfReportedSkills ?? undefined;
        this.verifiedSkills = verifiedSkills ?? undefined;
        this.pastCompanies = pastCompanies ?? undefined;
        this.currentCompany = currentCompany ?? undefined;
        this.currentCompanyId = currentCompanyId ?? undefined;
        this.currentJobIdAtBerufeNet = currentJobIdAtBerufeNet ?? undefined;
    }

    static createFromDao(
        cp: CareerProfile,
        user?: UserProfile,
        jobHistory?: Job[],
        professionalInterests?: string,
        qualifications?: Qualification[],
        selfReportedSkills?: Skill[],
        verifiedSkills?: Skill[],
        pastCompanies?: Company[],
        currentCompany?: Company,
        currentCompanyID?: string,
        currentJobIdAtBerufeNet?: string,
    ): CareerProfileDto {
        const jobHistoryAsArrayOfIds = jobHistory?.map((element) => element.id) || [];
        const qualificationsAsArrayOfIds = qualifications?.map((element) => element.id) || [];
        const selfReportedSkillsAsArrayOfIds =
            selfReportedSkills?.map((element) => element.id) || [];
        const verifiedSkillsAsArrayOfIds = verifiedSkills?.map((element) => element.id) || [];
        const pastCompaniesAsArrayOfIds = pastCompanies?.map((element) => element.id) || [];
        const currentCompanyObject = currentCompany?.id || "";

        return new CareerProfileDto(
            cp.id,
            cp.userId,
            user,
            jobHistoryAsArrayOfIds,
            professionalInterests,
            qualificationsAsArrayOfIds,
            selfReportedSkillsAsArrayOfIds,
            verifiedSkillsAsArrayOfIds,
            pastCompaniesAsArrayOfIds,
            currentCompanyObject,
            currentCompanyID,
            currentJobIdAtBerufeNet,
        );
    }
}
