import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserCreationDto, UserWithoutChildrenDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { USERSTATUS } from "@prisma/client";
import LoggerUtil from "../logger/logger";

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel, Sauer, Gerling
 */
@Injectable()
export class UserMgmtService {
    constructor(private db: PrismaService) {}

    /**
     * Creates a new user and saves it into the DB
     * @param dto Specifies the user to be created
     * @returns The newly created user
     */
    async createUser(dto: UserCreationDto) {
        // Create and return user
        try {
            //Create DB data
            const user = await this.db.userProfile.create({
                data: {
                    id: dto.id,
                    status: USERSTATUS.ACTIVE, //New users start active

                    //Create the respective objects (empty by default)
                    learningHistory: {},
                    careerProfile: {},
                    learningProfile: {},
                },
            });

            LoggerUtil.logInfo(
                "UserService::createUser",
                "Created user profile with id: " + dto.id,
            );
            return "Success";

            //Error handling if user profile could not be created
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    const exception = new ForbiddenException("User " + dto.id + " already exists");
                    LoggerUtil.logError("UserService::createUser", exception);
                    throw exception;
                }
            }
            const exception = new ForbiddenException("User " + dto.id + " could not be created");
            LoggerUtil.logError("UserService::createUser", exception);
            throw exception;
        }
    }

    /**
     * Loads the user with userId from the DB and returns it as DTO
     * @param userId The id of the user profile to be returned
     * @returns A user profile DTO ${UserWithoutChildrenDto}
     */
    public async getUser(userId: string) {
        //Find the user with userId in the DB (only top-level attributes id and status)
        const userDAO = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
        });

        //If the user does not exist in the DB
        if (!userDAO) {
            const exception = new NotFoundException(`Specified user not found: ${userId}`);
            LoggerUtil.logError("UserService::getUser", exception);
            throw exception;
        } else {
            //Return the DTO
            LoggerUtil.logInfo("UserService::getUser", "Returning user profile with id: " + userId);
            return UserWithoutChildrenDto.createFromDao(userDAO);
        }
    }

    /**
     * Returns all existing user profiles. Currently not used/required.
     * @returns A list with all existing user profiles.
     */
    /*     public async getAllUserProfiles() {
        //Get all user objects from the DB
        const users = await this.db.userProfile.findMany();

        //Throw an exception if there are no user objects
        if (!users) {
            const exception = new NotFoundException("Can not find any users");
            LoggerUtil.logError("UserService::getAllUserProfiles", exception);
            throw exception;
        }

        //Create a list with all user objects (as DTOs)
        const userList = new UserListDto();
        userList.users = users.map((user) => UserDto.createFromDao(user));

        LoggerUtil.logInfo(
            "UserService::getAllUserProfiles",
            "Returning list of all user profiles: " + userList.toString(),
        );

        return userList;
    } */

    /**
     * Changes the user state. Triggered by an MLS event (PUT or DELETE).
     * @param userId The ID of the user to be changed.
     * @param userState The new user state. True: Active, False: Inactive (for deleted users).
     * @returns updatedUser The user with userID and the new state userState.
     */
    async patchUserState(userId: string, userState: USERSTATUS) {
        try {
            const updatedUser = await this.db.userProfile.update({
                where: { id: "" + userId },
                data: {
                    status: userState, //Only change the state
                },
            });

            LoggerUtil.logInfo(
                "UserService::patchUserState",
                "User " + userId + " was set to " + userState,
            );
            return updatedUser;
        } catch (error) {
            LoggerUtil.logError("UserService::patchUserState", error);
            throw new ForbiddenException("User id " + userId + " does not exist in the database");
        }
    }

    //Maybe we still need this for administrative purposes later
    /*     async deleteUser(userId: string) {
        try {
            const user = await this.db.userProfile.delete({
                where: {
                    id: userId,
                },
            });

            return UserDto.createFromDao(user);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2025") {
                    throw new ForbiddenException("User not exists in System");
                }
            }
            throw error;
        }
    } */
}
