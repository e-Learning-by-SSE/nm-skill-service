import { Controller, Get, Body, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningProfileUpdateDto } from "../dto";
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

    @Get("{learning_profile_id}")
    getLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.getLearningProfileByID(learningProfileId);
    }

    @Patch("{learning_profile_id}")
    patchLearningProfileByID(@Param("learning_profile_id") learningProfileId: string, @Body() dto: LearningProfileUpdateDto) {
        this.learningProfileService.updateLearningProfile(learningProfileId, dto);
        return "Success";
    }
}
