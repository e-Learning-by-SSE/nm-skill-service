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

    /**
     * Returns a list with all users-profiles.
     * @returns List of all user-profiles.
     */
    @Get("")
    listUsers() {
        return this.userService.getAllUserProfiles();
    }

    /**
     * Creates an empty user profile for learners.
     * @param dto The user description
     * @returns The created user profile.
     * @todo: Clarify if needed, user profiles are created via the event handling
     */
    @Post("")
    @ApiOperation({ deprecated: true })
    addUser(@Body() dto: UserCreationDto) {
        return this.userService.createUser(dto);
    }

    /**
     * Returns the specified user-profile.
     * @param userId The ID of the user, whose profile shall be returned
     * @returns The specified user-profile.
     */

    @Get(":user_profile_id")
    getUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.getUser(userId);
    }

    /**
     * Deletes the specified user-profile (setting it to inactive).
     * @param userId The ID of the user, that shall be deleted (made inactive)
     * @returns Deleted/Deactivated user-profile.
     */

    @Delete(":user_profile_id")
    deleteUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.patchUserState(userId, USERSTATUS.INACTIVE);
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
