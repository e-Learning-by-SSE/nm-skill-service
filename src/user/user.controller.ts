import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserMgmtService } from "./user.service";

/**
 * Controller for managing the Users and its entities
 * @author Wenzel, Sauer, Gerling
 */
@ApiTags("User")
@Controller("user-profiles/")
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

    //User creation happens via the event system

    /**
     * Returns the specified user-profile. Used in MLS.
     * @param userId The ID of the user, whose profile shall be returned
     * @returns The specified user-profile DTO (without its child objects, but with their id).
     */

    @Get(":user_profile_id")
    getUserProfiles(@Param("user_profile_id") userId: string) {
        return this.userService.getUserById(userId);
    }
}
