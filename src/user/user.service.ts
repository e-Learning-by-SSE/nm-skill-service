import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CompanyCreationDto, CompanyDto, UserCreationDto, UserDto, UserListDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { STATUS, USERSTATUS } from "@prisma/client";
import { LearningProgressCreationDto } from "./dto/learningProgressCreation.dto";

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel
 */
@Injectable()
export class UserMgmtService {
    constructor(private db: PrismaService) {}

    async setProfileToInactive(userId: string) {
        try {
            const user = await this.db.userProfile.update({
                where: {
                    id: userId,
                },
                data: { status: USERSTATUS.INACTIVE },
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
    }

    async deleteUser(userId: string) {
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
    }

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
    async updateLearningProgress(
        userId: string,
        skillId: string
    ) {
        try {
            console.log("Update of learning progress is not yet (?) implemented.")
        } catch (error) {
            throw new Error("Error updating learning progress.");
        }
    }

    /**
     * When a user acquires a skill, create a learning progress object for them.
     * @param lProgressDto
     * @returns
     */
    async createProgressForUserId(userId: string, skillId: string) {
        try {
            const createEntry = await this.db.learningProgress.create({
                data: { userId: userId, skillId: skillId },
            });
            return createEntry;
        } catch (error) {
            throw new Error("Error creating learning progress.");
        }
    }

    async findProgressForUserId(id: string) {
        try {
            const progressEntries = await this.db.learningProgress.findMany({
                where: { userId: id },
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

    /**
     * Adds a new user
     * @param dto Specifies the user to be created
     * @returns The newly created user
     */
    async createUser(dto: UserCreationDto) {
        // Create and return user
        try {
            const user = await this.db.userProfile.create({
                data: {
                    id: dto.id,
                    name: dto.name,
                    status: USERSTATUS.ACTIVE,

                    ...(dto.companyId && { company: { connect: { id: dto.companyId } } }),
                    learningHistory: {
                        create: { id: dto.id },
                    },
                    learningBehavior: {
                        create: { id: dto.id },
                    },
                    careerProfile: {
                        create: { id: dto.id, currentCompanyId: dto.companyId },
                    },
                    learningProfile: {
                        create: { id: dto.id, semanticDensity: 0, semanticGravity: 0 },
                    },
                },
                include: { company: true },
            });
            if (user.company) {
                return UserDto.createFromDao(user, undefined, undefined, user.company);
            } else {
                return UserDto.createFromDao(user);
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("User already exists");
                }
            }
            throw new ForbiddenException("User could not be created");
        }
    }

    private async loadUser(userId: string) {
        const user = await this.db.userProfile.findUnique({
            where: {
                id: userId,
            },
            include: {
                company: true,
                learningProfile: true,
                careerProfile: true,
                learningProgress: true,
                learningHistory: true,
                learningBehavior: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Specified user not found: " + userId);
        }

        return user;
    }

    public async getUser(userId: string) {
        const dao = await this.loadUser(userId);

        if (!dao) {
            throw new NotFoundException(`Specified user not found: ${userId}`);
        }

        return UserDto.createFromDao(dao);
    }

    public async loadAllUsers() {
        const users = await this.db.userProfile.findMany();

        if (!users) {
            throw new NotFoundException("Can not find any users");
        }

        const userList = new UserListDto();
        userList.users = users.map((user) => UserDto.createFromDao(user));

        return users;
    }
    async createComp(dto: CompanyCreationDto) {
        // Create and return company
        try {
            const comp = await this.db.company.create({
                data: {
                    name: dto.name,
                },
            });

            return CompanyDto.createFromDao(comp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Company already exists");
                }
            }
            throw error;
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
                userProfileId: userID,
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
    async checkStatusForUnitsInPathOfLearningHistory(learningHistoryId: string) {
        try {
            // Find the learning path associated with the specified learning history
            const learningPath = await this.db.personalizedLearningPath.findFirst({
                where: {
                    userProfileId: learningHistoryId,
                },
                include: {
                    unitSequence: true,
                },
            });

            if (!learningPath) {
                throw new NotFoundException(
                    "Learning path not found for the given learning history.",
                );
            }

            const unitSequence = learningPath.unitSequence;

            const unitStatus = await Promise.all(
                unitSequence.map(async (unit) => {
                    const consumedUnit = await this.db.consumedUnitData.findFirst({
                        where: {
                            consumedLUId: unit.id,
                            startedBy: {
                                some: {
                                    id: learningHistoryId,
                                },
                            },
                        },
                    });
                    return {
                        unitId: unit.id,
                        status: consumedUnit ? consumedUnit.status : null,
                    };
                }),
            );

            return { unitStatus };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Changes the user state. Triggered by an MLS event (PUT or DELETE).
     * @param userId The ID of the user to be changed.
     * @param userState The new user state. True: Active, False: Inactive.
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
            return updatedUser;
        } catch (error) {
            throw new ForbiddenException("User could not be updated (non-existing user)");
        }
    }
}
