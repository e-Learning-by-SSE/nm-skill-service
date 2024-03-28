import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserCreationDto, UserDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { STATUS, USERSTATUS } from "@prisma/client";
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
     * @todo: This needs still a revision and further testing
     */
    async createUser(dto: UserCreationDto) {
        // Create and return user
        try {
            //Create DB data
            const user = await this.db.userProfile.create({
                data: {
                    id: dto.id,
                    status: USERSTATUS.ACTIVE, //New users start active

                    //Create the respective objects and connect them via the user profile id
                    learningHistory: {
                        create: { id: dto.id }, //Is this correct? This would set the user id as lH id?
                    },
                    careerProfile: {
                        create: { id: dto.id },
                    },
                    learningProfile: {
                        create: { id: dto.id, semanticDensity: 0, semanticGravity: 0 },
                    },
                },
            });

            LoggerUtil.logInfo(
                "UserService::createUser",
                "Created user profile without company and user id: " + dto.id,
            );
            return UserDto.createFromDao(user);

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
     * @returns A user profile DTO
     */
    public async getUser(userId: string) {
        //Find the user with userId in the DB
        const userDAO = await this.db.userProfile.findUnique({   
            where: {
                id: userId,
            },
            //Returns all user fields including learningProfile, careerProfile, and learningHistory (including its fields)
            include: {
                learningProfile: true,
                careerProfile: true,
                learningHistory: {
                    include: {
                        learnedSkills: true,
                        startedLearningUnits: true,
                        personalPaths: true,
                    },
                },
            }
        });

        //If the user does not exist in the DB
        if (!userDAO) {
            const exception = new NotFoundException(`Specified user not found: ${userId}`);
            LoggerUtil.logError("UserService::getUser", exception);
            throw exception;
        } else {
            //Return the DTO
            LoggerUtil.logInfo("UserService::getUser", "Returning user profile with id: " + userId);
            return UserDto.createFromDao(userDAO);
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

    async deleteProgressForId(id: string) {
        const recordToDelete = await this.db.learningProgress.findUnique({
            where: {
                id: id, // Replace with the actual record ID you want to delete
            },
        });

        if (!recordToDelete) {
            // The record with the specified ID doesn't exist; handle it accordingly
            throw new NotFoundException(`Record not found: ${id}`);
        }

        const dao = await this.db.learningProgress.delete({ where: { id: id } });

        return dao;
    }

    /**
     * ToDo: What is the use case? Re-acquisition of the same skill?
     * @param userId
     * @param updateLearningProgressDto
     */
    async updateLearningProgress(userId: string, skillId: string) {
        try {
            console.log("Update of learning progress is not yet (?) implemented.");
        } catch (error) {
            throw new Error("Error updating learning progress.");
        }
    }

    /**
     * When a user acquires a skill, create a learning progress object for them (matches skill and user).
     * Currently, the same skill can be acquired multiple times. Every time there is a new learning progress entry created.
     * @param lProgressDto
     * @returns
     */
    async createProgressForUserId(userId: string, skillId: string) {
        try {
            const createEntry = await this.db.learningProgress.create({
                data: { learningHistoryId: userId, skillId: skillId },  //TODO needs to change to history id
            });
            return createEntry;
        } catch (error) {
            throw new ForbiddenException("Error creating learning progress");
        }
    }

    async findProgressForUserId(id: string) {
        try {
            const progressEntries = await this.db.learningProgress.findMany({
                where: { learningHistoryId: id }, //TODO needs to change to history id
            });

            if (progressEntries.length === 0) {
                throw new NotFoundException("No learning progress found.");
            }

            return progressEntries;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw new Error("Error finding learning progress.");
        }
    }

    async editStatusForAConsumedUnitById(consumedUnitId: string, status: STATUS) {
        try {
            // Find users with the given learning unit in their learning history

            const consumed = await this.db.consumedUnitData.update({
                where: {
                    id: consumedUnitId,
                },
                data: {
                    status: status,
                },
            });
            return consumed;
        } catch (error) {
            // Handle errors

            throw new NotFoundException("Unit not Found in DB ");
        }
    }

    async createLearningPathForUser(
        userID: string,
        learningUnitsIds: string[],
        pathTeachingGoalsIds: string[],
    ) {
        let existingUserProfile = await this.db.userProfile.findUnique({
            where: { id: userID },
        });

        if (!existingUserProfile) {
            existingUserProfile = await this.db.userProfile.create({
                data: {
                    id: userID,
                },
            });
        }

        let existingUserHistory = await this.db.learningHistory.findUnique({
            where: { id: userID },
        });
        if (!existingUserHistory) {
            existingUserHistory = await this.db.learningHistory.create({
                data: {
                    userId: userID,
                    id: userID,
                },
            });
        }

        const createdPersonalizedLearningPath = await this.db.personalizedLearningPath.create({
            data: {
                learningHistoryId: userID,
                unitSequence: {
                    connect: learningUnitsIds.map((id) => ({ id })),
                },
                pathTeachingGoals: {
                    connect: pathTeachingGoalsIds.map((id) => ({ id })),
                },
            },
        });

        return { createdPersonalizedLearningPath };
    }
    async checkStatusForUnitsInPathOfLearningHistory(learningHistoryId: string, pathId: string) {
        // Find the learning path associated with the specified learning history
        const learningPath = await this.db.personalizedLearningPath.findUnique({
            where: {
                learningHistoryId: learningHistoryId,
                id: pathId,
            },
            include: {
                unitSequence: {
                    include: {
                        unit: true,
                    },
                },
            },
        });

        if (!learningPath) {
            throw new NotFoundException(
                `Learning path ${pathId} not found for the given learning history ${learningHistoryId}.`,
            );
        }

        return learningPath.unitSequence.map((unit) => ({
            unit: unit.unit,
            status: unit.unit.status,
        }));
    }
}
