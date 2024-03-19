import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserCreationDto, CompanyCreationDto } from "./dto";
import { UserMgmtService } from "./user.service";
import { USERSTATUS } from "@prisma/client";

/**
 * Controller for managing the Users and its entities
 * @author Wenzel, Sauer, Gerling
 */
@ApiTags("User")
@Controller("user-profiles")
export class UserMgmtController {
    constructor(private userService: UserMgmtService) {}

//This is currently de-activated, as this endpoint is not required at the moment, but may be later    
    /**
     * Returns a list with all users-profiles.
     * @returns List of all user-profiles.
     */
//    @Get("")
//    listUsers() {
//        return this.userService.getAllUserProfiles();
//    }


    /**
     * Returns the specified user-profile. Used in MLS.
     * @param userId The ID of the user, whose profile shall be returned
     * @returns The specified user-profile.
     */

    @Get(":user_profile_id")
    getUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.getUser(userId);
    }



    @Post("add_company")
    addCompany(@Body() dto: CompanyCreationDto) {
        return this.userService.createComp(dto);
    }

    @Get(":id/learning-progress")
    async getUserLearningProgress(@Param("id") id: string) {
        // Fetch a user's learning progress by user ID
        return this.userService.findProgressForUserId(id);
    }

    //@todo: Do we need this? Should happen via events?
    @Post(":id/learning-progress")
    async createLearningProgress(@Param("id") userId: string, @Body() skillId: string) {
        // Create a new learning progress entry for a user
        return this.userService.createProgressForUserId(userId, skillId);
    }

    @Delete(":id/learning-progress")
    async deleteLearningProgress(@Param("id") progressId: string) {
        return this.userService.deleteProgressForId(progressId);
    }
}
