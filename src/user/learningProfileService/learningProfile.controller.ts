import { Controller, Get, Body, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningProfileUpdateDto } from "./dto";
import { LearningProfileService } from "./learningProfile.service";

/**
 * Controller for managing the users's learning profiles
 * @author Wenzel, Sauer, Gerling
 */
@ApiTags("LearningProfiles")
@Controller("learning-profiles/")
export class LearningProfileController {
    constructor(private learningProfileService: LearningProfileService) {}

    //Post and delete are not required

    /**
     * Returns the learning profile with the specified ID
     * @param learningProfileId The ID of the requested learning profile
     * @returns The learning profile with the specified ID as DTO
     */
    @Get(":learning_profile_id")
    getLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.getLearningProfileByID(learningProfileId);
    }

    /**
     * Updates the learning profile with the specified ID according to the values sent with the DTO (partial update is possible)
     * @param learningProfileId The ID of the learning profile to update
     * @param dto The new values for the learning profile
     * @returns Returns "Success" if the update was successful
     */
    @Patch(":learning_profile_id")
    patchLearningProfileByID(
        @Param("learning_profile_id") learningProfileId: string,
        @Body() dto: LearningProfileUpdateDto,
    ) {
        return this.learningProfileService.updateLearningProfile(learningProfileId, dto);
    }
}
