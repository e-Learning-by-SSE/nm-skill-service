import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CareerProfileService } from "./careerProfile.service";
import { CareerProfileFilterDto } from "./dto/careerProfile-filter.dto";
import { CareerProfileDto } from "./dto/careerProfile.dto";
import { JobDto } from "./dto/job.dto";
import { QualificationDto } from "./dto/qualification.dto";

/**
 * Controller for managing the career profiles
 * ToDo: Is the profile only accessible via its user profile, or do we need access to all / specific career profiles?
 */
@ApiTags("CareerProfile")
@Controller("career-profiles")
export class CareerProfileController {
    constructor(private careerService: CareerProfileService) {}

    // Filter: Includes careerProfile.dto.ts
    /**
     * If we specify a user ID, we get their career profile(s). Otherwise, get all profiles.
     * @param filter
     * @returns
     */
    @Get("")
    @ApiQuery({
        name: "userId",
        required: false,
        type: String,
        description: "Filter by userId",
    })
    getCareerProfileByFilter(@Query() filter: CareerProfileFilterDto) {
        return this.careerService.getCareerProfileByFilter(filter);
    }

    @Post("")
    addCareerProfile(@Body() dto: CareerProfileDto) {
        return this.careerService.createCareerProfile(dto);
    }

    @Get(":career_profile_id")
    getCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerService.getCareerProfileByID(careerProfileId);
    }

    @Delete(":career_profile_id")
    delCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerService.deleteCareerProfileByID(careerProfileId);
    }

    @Patch(":career_profile_id")
    patchCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: CareerProfileDto,
    ) {
        return this.careerService.patchCareerProfileByID(careerProfileId, dto);
    }

    @Post(":career_profile_id/job_history")
    addJob(@Param("career_profile_id") careerProfileId: string, @Body() dto: JobDto) {
        return this.careerService.createJob(careerProfileId, dto);
    }

    @Patch(":career_profile_id/:job_history_id")
    patchJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
        @Body() dto: JobDto,
    ) {
        return this.careerService.patchJobHistoryAtCareerProfileByID(
            careerProfileId,
            jobHistoryId,
            dto,
        );
    }

    @Delete(":career_profile_id/:job_history_id")
    deleteJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
    ) {
        return this.careerService.deleteJobHistoryAtCareerProfileByID(
            careerProfileId,
            jobHistoryId,
        );
    }

    @Post(":career_profile_id/qualifications/")
    addQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: QualificationDto,
    ) {
        return this.careerService.createQualificationForCareerProfile(careerProfileId, dto);
    }

    @Get(":career_profile_id/qualifications/:qualification_id")
    getQualificationForCareerProfile(@Param("qualification_id") qualificationId: string) {
        return this.careerService.getQualificationForCareerProfile(qualificationId);
    }

    @Patch(":career_profile_id/qualifications/:qualification_id")
    patchQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
        @Body() dto: QualificationDto,
    ) {
        return this.careerService.patchQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
            dto,
        );
    }

    @Delete(":career_profile_id/qualifications/:qualification_id")
    deleteQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
    ) {
        return this.careerService.deleteQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
        );
    }
}
