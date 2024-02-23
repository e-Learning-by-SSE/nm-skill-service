import { Controller, Get, Post, Body, Param, Delete, Patch, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
    UserCreationDto,
    CompanyCreationDto,
    LearningProfileCreationDto,
    CreateLearningProgressDto,
    CareerProfileCreationDto,
    JobCreationDto,
    LearningHistoryCreationDto,
    LearningProfileDto,
} from "./dto";
import { QualificationCreationDto } from "./dto/qualification-creation.dto";
import { UserMgmtService } from "./user.service";
import { CareerProfileFilterDto } from "./dto/careerProfile-filter.dto";
import { JobUpdateDto } from "./dto/job-update.dto";
import { CareerProfileService } from "./careerProfile.service";
import { LearningHistoryService } from "./learningHistory.service";
import { LearningProfileService } from "./learningProfile.service";
/**
 * Controller for managing the Users and its entities
 * @author Wenzel
 */
@ApiTags("User")
@Controller("")
export class UserMgmtController {
    constructor(
        private userService: UserMgmtService,
        private careerService: CareerProfileService,
        private learningHistoryService: LearningHistoryService,
        private learningProfileService: LearningProfileService,
    ) {}

    /**
   * Lists all users.
   
   * @returns List of all users.
   */
    @Get("showAllUser")
    listUsers() {
        return this.userService.loadAllUsers();
    }

    /**
     * Creates an empty user profile for learners.
     * @param dto The user description
     * @returns The created user profile.
     */
    @Post("/users/")
    addUser(@Body() dto: UserCreationDto) {
        return this.userService.createUser(dto);
    }

    @Post("add_company")
    addCompany(@Body() dto: CompanyCreationDto) {
        return this.userService.createComp(dto);
    }

    @Post("add_learningProfile")
    addLearningProfile(@Body() dto: LearningProfileCreationDto) {
        return this.learningProfileService.createLearningProfile(dto);
    }

    @Get("/learning-profiles/:learning_profile_id")
    getLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.getLearningProfileByID(learningProfileId);
    }

    @Delete("/learning-profiles/:learning_profile_id")
    delLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.deleteLearningProfileByID(learningProfileId);
    }

    @Patch("/learning-profiles/:learning_profile_id")
    patchLearningProfileByID(
        @Param("learning_profile_id") learningProfileId: string,
        @Body() dto: LearningProfileDto,
    ) {
        return this.learningProfileService.patchLearningProfileByID(learningProfileId, dto);
    }







    @Post("add_LearningHistory")
    addLearningHistory(@Body() dto: LearningHistoryCreationDto) {
        return this.learningHistoryService.createLearningHistory(dto);
    }

    @Post("add_CareerProfile")
    addCareerProfile(@Body() dto: CareerProfileCreationDto) {
        return this.careerService.createCareerProfile(dto);
    }

    /**
     * Returns the specified user-profile.
     * @param userId The ID of the user, that shall be returned
     * @returns The specified user-profile.
     */

    @Get("/user-profiles/:user_profile_id")
    getUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.getUser(userId);
    }

    /**
     * Deletes the specified user-profile.
     * @param userId The ID of the user, that shall be returned
     * @returns Deleted specified user-profile.
     */

    @Delete("/user-profiles/:user_profile_id")
    deleteUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.setProfileToInactive(userId);
    }

    @Get(":id/learning-progress")
    async getUserLearningProgress(@Param("id") id: string) {
        // Fetch a user's learning progress by user ID
        return this.userService.findProgressForUserId(id);
    }

    @Post(":id/learning-progress")
    async createLearningProgress(
        @Param("id") userId: string,
        @Body() createLearningProgressDto: CreateLearningProgressDto,
    ) {
        // Create a new learning progress entry for a user
        return this.userService.createProgressForUserId(userId, createLearningProgressDto);
    }

    @Delete(":id/learning-progress")
    async deleteLearningProgress(@Param("id") progressId: string) {
        return this.userService.deleteProgressForId(progressId);
    }

    // Filter: Includes careerProfile.dto.ts
    @Get("/career-profiles/")
    @ApiQuery({
        name: "userId",
        required: false,
        type: String,
        description: "Filter by userId",
    })
    getCareerProfileByFilter(@Query() filter: CareerProfileFilterDto) {
        return this.careerService.getCareerProfileByFilter(filter);
    }

    @Get("/career-profiles/:career_profile_id")
    getCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerService.getCareerProfileByID(careerProfileId);
    }

    @Delete("/career-profiles/:career_profile_id")
    delCareerProfileByID(@Param("career_profile_id") careerProfileId: string) {
        return this.careerService.deleteCareerProfileByID(careerProfileId);
    }

    @Patch("/career-profiles/:career_profile_id")
    patchCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: CareerProfileCreationDto,
    ) {
        return this.careerService.patchCareerProfileByID(careerProfileId, dto);
    }
    @Post("/career-profiles/:career_profile_id/job_history")
    addJob(@Param("career_profile_id") careerProfileId: string, @Body() dto: JobCreationDto) {
        return this.careerService.createJob(careerProfileId, dto);
    }
    @Patch("/career-profiles/:career_profile_id/:job_history_id")
    patchJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
        @Body() dto: JobUpdateDto,
    ) {
        return this.careerService.patchJobHistoryAtCareerProfileByID(
            careerProfileId,
            jobHistoryId,
            dto,
        );
    }
    @Delete("/career-profiles/:career_profile_id/:job_history_id")
    deleteJobHistoryAtCareerProfileByID(
        @Param("career_profile_id") careerProfileId: string,
        @Param("job_history_id") jobHistoryId: string,
    ) {
        return this.careerService.deleteJobHistoryAtCareerProfileByID(
            careerProfileId,
            jobHistoryId,
        );
    }

    @Post("/career-profiles/:career_profile_id/qualifications/")
    addQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Body() dto: QualificationCreationDto,
    ) {
        return this.careerService.createQualificationForCareerProfile(careerProfileId, dto);
    }

    @Get("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    getQualificationForCareerProfile(@Param("qualification_id") qualificationId: string) {
        return this.careerService.getQualificationForCareerProfile(qualificationId);
    }

    @Patch("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    patchQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
        @Body() dto: QualificationCreationDto,
    ) {
        return this.careerService.patchQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
            dto,
        );
    }

    @Delete("/career-profiles/:career_profile_id/qualifications/:qualification_id")
    deleteQualificationToCareerProfile(
        @Param("career_profile_id") careerProfileId: string,
        @Param("qualification_id") qualificationId: string,
    ) {
        return this.careerService.deleteQualificationForCareerProfile(
            careerProfileId,
            qualificationId,
        );
    }

    @Get("learning-history/:history_id")
    async getLearningHistoryById(@Param("history_id") historyId: string) {
        // Fetch a user's learning progress by user ID
        return this.learningHistoryService.getLearningHistoryById(historyId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Get("learning-history/:history_id")
    async getCompPathsIdsByHistoryById(@Param("history_id") historyId: string) {
        // Fetch all Computed Paths for a given LearningHistoryId
        return this.learningHistoryService.getCompPathsIdsByHistoryById(historyId);
    }

    @Post("learning-history/")
    async createLearningHistory(@Body() createLearningHistoryDto: LearningHistoryCreationDto) {
        // Create a new learning progress entry for a user
        return this.learningHistoryService.createLearningHistory(createLearningHistoryDto);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Get("/learning-history/:history_id/:comp_path_id")
    getCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
    ) {
        return this.userService.getCompPathByID(historyId, compPathId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Delete("/learning-history/:history_id/:comp_path_id")
    delCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
    ) {
        return this.userService.delCompPathByID(historyId, compPathId);
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Patch("/learning-history/:history_id/:comp_path_id")
    patchCompPathByID(
        @Param("history_id") historyId: string,
        @Param("comp_path_id") compPathId: string,
        @Body() dto: LearningProfileDto,
    ) {
        return this.userService.patchCompPathByID(historyId, compPathId, dto);
    }
}

/**
 *
 *
 *@Put(':id/learning-progress')
 *  async updateLearningProfile(
 *    @Param('id') userId: string,
 *    @Body() updateLearningProgressDto: UpdateLearningProgressDto,
 *  ) {
 *    // Update a user's learning profile
 *    return this.userService.updateLearningProgress(userId, updateLearningProgressDto);
 *  }
 */
