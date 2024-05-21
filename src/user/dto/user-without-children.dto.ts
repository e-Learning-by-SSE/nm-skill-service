import { IsNotEmpty } from "class-validator";
import { USERSTATUS, UserProfile } from "@prisma/client";

/**
 * DTO for retrieving a user profile without its nested child objects.
 * Contains top-level information about a user.
 * @author Sauer, Gerling
 */
export class UserWithoutChildrenDto {
    @IsNotEmpty()
    id: string; //The unique id of the user, set by MLS
    learningProfileId: string; //Contains a link to the learning preferences of a user (their id is the same as the userId)
    careerProfileId: string; //Contains a link to the past jobs and self-reported skills of a user (their id is the same as the userId)
    learningHistoryId: string; //Contains a link to the learned skills, their date, and the consumed learning units (their id is the same as the userId)
    status: USERSTATUS; // (active, inactive)  value set by User-Events (create / delete), default value is "active"

    /**
     * Converts a user profile object (DAO) from the DB into a DTO.
     * @param userProfile The user profile object from the DB.
     * @returns A user profile DTO with its unique id and status (active/inactive), as well as fields for the learningProfileId, careerProfileId, and learningHistoryId (all the same as the userId).
     */
    static createFromDao(
        //This part is coming from the DB
        user: UserProfile,
    ): UserWithoutChildrenDto {
        return {
            id: user.id,
            learningProfileId: user.id,
            careerProfileId: user.id,
            learningHistoryId: user.id,
            status: user.status as USERSTATUS,
        };
    }
}
