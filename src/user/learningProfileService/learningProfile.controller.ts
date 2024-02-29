import { Controller, Get, Post, Body, Param, Delete, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningProfileCreationDto, LearningProfileDto } from "../dto";
import { UserMgmtService } from "../user.service";
import { LearningProfileService } from "./learningProfile.service";


/**
 * Controller for managing the users's learning profiles 
 * ToDo: Should be accessible only via user?
 * @author Wenzel, Sauer, Gerling
 */
@ApiTags("Learning Profiles")
@Controller("learning-profiles")
export class UserMgmtController {
    constructor(
        private userService: UserMgmtService,
        private learningProfileService: LearningProfileService,
    ) {}


    @Post("")
    addLearningProfile(@Body() dto: LearningProfileCreationDto) {
        return this.learningProfileService.createLearningProfile(dto);
    }

    @Get(":learning_profile_id")
    getLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.getLearningProfileByID(learningProfileId);
    }

    @Delete(":learning_profile_id")
    delLearningProfileByID(@Param("learning_profile_id") learningProfileId: string) {
        return this.learningProfileService.deleteLearningProfileByID(learningProfileId);
    }

    @Patch(":learning_profile_id")
    patchLearningProfileByID(
        @Param("learning_profile_id") learningProfileId: string,
        @Body() dto: LearningProfileDto,
    ) {
        return this.learningProfileService.patchLearningProfileByID(learningProfileId, dto);
    }

}

