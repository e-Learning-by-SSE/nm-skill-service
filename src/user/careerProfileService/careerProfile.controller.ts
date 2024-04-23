import { Controller, Get, Post, Body, Param, Delete, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CareerProfileService } from "./careerProfile.service";
import { CareerProfileDto } from "./dto/careerProfile.dto";
import { JobDto } from "./dto/job.dto";
import { QualificationDto } from "./dto/qualification.dto";

/**
 * Controller for managing the career profiles of users
 */
@ApiTags("CareerProfile")
@Controller("career-profiles")
export class CareerProfileController {
    constructor(private careerService: CareerProfileService) {}

    /**
     * Return all existing career profiles. Used for ai stuff.
     * @returns All currently existing career profiles (including their child objects) from all users.
     */
    @Get("")
    getAllCareerProfiles() {
        return this.careerService.getAllCareerProfiles();
    }

    /**
     * Returns the requested career profile
     * @param careerProfileId The career profile of the user with the same id
     * @returns The career profile DTO for the specified user / with the specified id
     */
    @Get(":career_profile_id")
    getCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerService.getCareerProfileByID(careerProfileId);
    }

    /**
     * Allows a user to update their career profile
     * @param careerProfileId The id of the career profile to update (and of the belonging user)
     * @param dto The new data for the career profile
     * @returns A success message if successful
     */
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
        @Body() dto: QualificationDto,
    ) {
        return this.careerService.createQualificationForCareerProfile(dto);
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
        @Param("qualification_id") qualificationId: string,
    ) {
        return this.careerService.deleteQualificationForCareerProfile(
            qualificationId,
        );
    }
}
