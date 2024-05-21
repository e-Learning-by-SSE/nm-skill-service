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
     * Returns the requested career profile including all child objects (sorted ascending by (start)date)
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
     * @returns The updated part of the career profile
     */
    @Patch(":career_profile_id")
    patchCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: CareerProfileDto,
    ) {
        return this.careerService.patchCareerProfileByID(careerProfileId, dto);
    }

    /**
     * Creates a new job object and adds it to the user's job history and their career profile
     * @param careerProfileId Id of the user and its career profile (both are the same) to which the job shall be added
     * @param dto The job data to add
     * @returns A success message if successful (there is no use case where we need the job object itself, so we don't return it)
     */
    @Post(":career_profile_id/job_history")
    addJob(@Param("career_profile_id") careerProfileId: string, @Body() dto: JobDto) {
        return this.careerService.addJobToJobHistoryAtCareerProfile(careerProfileId, dto);
    }

    /**
     * Updates the values of an existing job in the job history of a user
     * @param jobId The id of the job to update
     * @param dto The new data for the job
     * @returns A success message if successful (there is no use case where we need the job object itself, so we don't return it)
     */
    @Patch(":career_profile_id/:job_history:/job_id")
    patchJobHistoryAtCareerProfileByID(@Param("job_id") jobId: string, @Body() jobDto: JobDto) {
        return this.careerService.updateJobInCareerProfile(jobId, jobDto);
    }

    /**
     * Deletes an existing job from the job history (and career profile) of a user
     * @param jobId The job to be removed from the job history
     * @returns A success message if successful (we cannot return the deleted object)
     */
    @Delete(":career_profile_id/:job_history:/job_id")
    deleteJobHistoryAtCareerProfileByID(@Param("job_id") jobId: string) {
        return this.careerService.deleteJobFromHistoryInCareerProfile(jobId);
    }

    /**
     * Adds a new qualification to the career profile of a user
     * @param dto The qualification to add
     * @param careerProfileId The id of the user and its career profile (both are the same) to which the qualification shall be added
     * @returns A success message if successful (there is no use case where we need the qualification object itself, so we don't return it)
     */
    @Post(":career_profile_id/qualifications/")
    addQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: QualificationDto,
    ) {
        return this.careerService.addQualificationToCareerProfile(careerProfileId, dto);
    }

    /**
     * Updates an existing qualification in the career profile of a user
     * @param qualificationId The id of the qualification to update
     * @param dto The new data for the qualification
     * @returns A success message if successful (there is no use case where we need the qualification object itself, so we don't return it)
     */
    @Patch(":career_profile_id/qualifications/:qualification_id")
    patchQualificationToCareerProfile(
        @Param("qualification_id") qualificationId: string,
        @Body() dto: QualificationDto,
    ) {
        return this.careerService.updateQualificationInCareerProfile(qualificationId, dto);
    }

    /**
     * Deletes an existing qualification from the career profile of a user
     * @param qualificationId The id of the qualification to delete
     * @returns A success message if successful (we cannot return the deleted object)
     */
    @Delete(":career_profile_id/qualifications/:qualification_id")
    deleteQualificationToCareerProfile(@Param("qualification_id") qualificationId: string) {
        return this.careerService.deleteQualificationFromCareerProfile(qualificationId);
    }
}
