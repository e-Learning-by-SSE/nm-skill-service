import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { MLSEvent } from "./dtos/mls-event.dto";
import { UserCreationDto } from "../user/dto/user-creation.dto";
import LoggerUtil from "../logger/logger";
import { UserMgmtService } from "../user/user.service";
import { ForbiddenException } from "@nestjs/common";
import { USERSTATUS } from "@prisma/client";
import { MlsActionType } from "./dtos";

@Injectable()
export class UserEventService {
    constructor(private userService: UserMgmtService) {}

    /**
     * Handles events for MLS users
     * @param mlsEvent The event to handle, contains information about the user to update (or create).
     * @returns Depends on the case, see the respective methods for more information        
     */
    async handleUserEvent(mlsEvent: MLSEvent) {
        //Create a new empty user profile when a user is created in the MLS system
        if (mlsEvent.method === MlsActionType.POST) {
            return await this.handlePOSTEvent(mlsEvent);

            //Change the user profile state when it is changed in MLS
            //TODO: We could also create a user if it is not in our db, but currently we only get an update when the user should be deleted, so a new creation makes no sense
        } else if (mlsEvent.method === MlsActionType.PUT) {
            return await this.handlePUTEvent(mlsEvent);

            //This is the same as PUT state to "inactive"
        } else if (mlsEvent.method === MlsActionType.DELETE) {
            LoggerUtil.logInfo("EventService::deleteUser", mlsEvent.id);
            return this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);

            // When the method is not implemented
        } else {
            LoggerUtil.logInfo("EventService::deleteUserFailed", mlsEvent.id);
            throw new ForbiddenException(
                "UserEvent: Method for this action type (" + mlsEvent.method + ") not implemented.",
            );
        }
    }

    /**
     * Handles POST events for MLS users (creates a new user with the same id as in the MLS system)
     * @param mlsEvent Contains information about the user to create.
     * @returns A success message if the user was successfully created.
     */
    async handlePOSTEvent(mlsEvent: MLSEvent) {
        //Create DTO
        const userDto: UserCreationDto = {
            id: mlsEvent.id,
            //Initially, users are created as active users. They only become inactive when deleted.
        };
        LoggerUtil.logInfo("EventService::createUserDTO", mlsEvent.id);

        //Create user profile in database
        await this.userService.createUser(userDto);
        LoggerUtil.logInfo("EventService::createUser", userDto);

        return "User created successfully!";
    }

    /**
     * Handles PUT events for MLS users (updates the user or creates a new one if not existing).
     * @param mlsEvent The event to handle, contains information about the user to update (or create).
     * @returns A success message if the user was successfully updated or created.
     */
    async handlePUTEvent(mlsEvent: MLSEvent) {
        //Try to read the state attribute of the user
        const userState = mlsEvent.payload["state" as keyof JSON];
        //Declare required object
        let userProfile;

        //Check if we got a valid result (MLS uses a boolean, which is parsed to a number) and change the user state accordingly
        if (userState != undefined) {
            //This case can happen if we manually import users from MLS via the respective button (this will trigger PUT events instead of POST)
            if (userState == "1" || userState.toString() == "true") {
                LoggerUtil.logInfo("EventService::updateUserActive", userState);

                //Then try to either update the user profile, or create a new one if not existent
                try {
                    //Update the existing learning unit in our system with the new values from MLS (currently this changes nothing, as we only update the state, but it allows us to create missed users)
                    userProfile = await this.userService.patchUserState(
                        mlsEvent.id,
                        USERSTATUS.ACTIVE,
                    );

                    //When the user profile is not in our database
                } catch (exception) {
                    if (exception instanceof ForbiddenException) {
                        //Create a new user profile in our system with the new values from MLS (this can happen if we missed a post request or the update is manually triggered by MLS)
                        await this.userService.createUser({ id: mlsEvent.id });

                        LoggerUtil.logInfo(
                            "EventService::updateUserActive(createNewUserProfile)",
                            mlsEvent.id,
                        );
                    }
                }
                return "Successfully updated user profile!";

                //This is the same as the DELETE event
            } else if (userState == "0" || userState == "false") {
                LoggerUtil.logInfo("EventService::updateUserInactive", userState);
                return await this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);
            } else {
                LoggerUtil.logInfo("EventService::updateUserFailed", userState);
                throw new ForbiddenException(
                    "UserEvent: Unknown state attribute value " +
                        userState +
                        " from MLS user entity. Update aborted.",
                );
            }
        } else {
            LoggerUtil.logInfo("EventService::updateUserFailed", userState);
            throw new ForbiddenException(
                "UserEvent: Could not read the state attribute from MLS user entity. Update aborted.",
            );
        }
    }
}
