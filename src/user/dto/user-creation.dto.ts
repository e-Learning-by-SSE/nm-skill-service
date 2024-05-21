import { IsNotEmpty, IsString } from "class-validator";

/**
 * For creating a new user (via the event system).
 * Requires the MLS id. 
 * The other attributes are created empty by default
 * @author Sauer, Gerling
 */

export class UserCreationDto {
    @IsNotEmpty({message: 'User id must not be empty' })
    @IsString({message: 'User id must be a valid string' })
    id: string; //The unique id of the user, set by MLS
}
