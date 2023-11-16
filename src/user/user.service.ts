import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import {
    CareerProfileCreationDto,
    CareerProfileDto,
    CompanyCreationDto,
    CompanyDto,
    CreateLearningProgressDto,
    JobCreationDto,
    JobDto,
    LearningHistoryCreationDto,
    LearningHistoryDto,
    LearningProfileCreationDto,
    LearningProfileDto,
    QualificationDto,
    UpdateLearningProgressDto,
    UserCreationDto,
    UserDto,
    UserListDto,
} from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { CareerProfileFilterDto } from "./dto/careerProfile-filter.dto";
import { STATUS } from "@prisma/client";

/**
 * Service that manages the creation/update/deletion Users
 * @author Wenzel
 */
@Injectable()
export class UserMgmtService {
    constructor(private db: PrismaService) {}

    async patchCompPathByID(historyId: string, compPathId: string, dto: LearningProfileDto) {
        throw new Error("Method not implemented.");
    }
    async delCompPathByID(historyId: string, compPathId: string) {
        throw new Error("Method not implemented.");
    }
    async getCompPathByID(historyId: string, compPathId: string) {
        throw new Error("Method not implemented.");
    }

    async patchCompPathViaLearningProfileByID(learningProfileId: string, dto: LearningProfileDto) {
        throw new Error("Method not implemented.");
    }

    async createLearningHistory(
        historyId: string,
        createLearningHistoryDto: LearningHistoryCreationDto,
    ) {
        throw new Error("Method not implemented.");
    }
    async getLearningHistoryById(historyId: string) {
        throw new Error("Method not implemented.");
    }

    async getLearningProfileByID(learningProfileId: string) {
        throw new Error("Method not implemented.");
    }
    async deleteLearningProfileByID(learningProfileId: string) {
        throw new Error("Method not implemented.");
    }
    async patchLearningProfileByID(learningProfileId: string, dto: LearningProfileDto) {
        throw new Error("Method not implemented.");
    }
    async patchCareerProfileByID(careerProfileId: string, dto: CareerProfileCreationDto) {
        throw new Error("Method not implemented.");
    }
    async getCareerProfileByID(careerProfileId: string) {
        throw new Error("Method not implemented.");
    }
    async getUserByFilter(filter: CareerProfileFilterDto) {
        throw new Error("Method not implemented.");
    }
    async deleteUser(userId: string) {
        throw new Error("Method not implemented.");
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
    async updateLearningProgress(
        userId: string,
        updateLearningProgressDto: UpdateLearningProgressDto,
    ) {
        try {
        } catch (error) {
            throw new Error("Error updating learning progress.");
        }
    }
    async createProgressForUserId(
        userId: string,
        createLearningProgressDto: CreateLearningProgressDto,
    ) {
        try {
            const createEntry = await this.db.learningProgress.create({
                data: { userId, ...createLearningProgressDto },
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
                    name: dto.name,
                    companyId: dto.companyId,
                    status: "active",
                },
            });

            return UserDto.createFromDao(user);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("User already exists");
                }
            }
            throw error;
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
                //   LearningHistory  LearningHistory?
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

    async createJob(dto: JobCreationDto) {
        // Create and return a Job
        try {
            const jb = await this.db.job.create({
                data: {
                    jobtitle: dto.jobtitle,
                    starttime: dto.starttime,
                    endtime: dto.endtime,
                    companyId: dto.companyId,
                    userId: dto.userId,
                },
            });

            return JobDto.createFromDao(jb);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Job already exists");
                }
            }
            throw error;
        }
    }

    async createLH(dto: LearningHistoryCreationDto) {
        try {
            const lh = await this.db.learningHistory.create({
                data: {
                    userId: dto.userId,
                },
            });

            return LearningHistoryDto.createFromDao(lh);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Learning History could not be created");
                }
            }
            throw error;
        }
    }

    async createLP(dto: LearningProfileCreationDto) {
        try {
            const lp = await this.db.learningProfile.create({
                data: {
                    semanticDensity: Number(dto.semanticDensity),
                    semanticGravity: Number(dto.semanticGravity),
                    mediaType: dto.mediaType,
                    language: dto.language,
                    userId: dto.userId,
                },
            });

            return LearningProfileDto.createFromDao(lp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Learning Profile could not be created");
                }
            }
            throw error;
        }
    }

    async createCP(dto: CareerProfileCreationDto) {
        try {
            const cp = await this.db.careerProfile.create({
                data: {
                    professionalInterests: dto.professionalInterests,
                    userId: dto.userId,
                    currentCompanyId: dto.currentCompanyId,
                },
            });

            return CareerProfileDto.createFromDao(cp);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Career Profile could not be created");
                }
            }
            throw error;
        }
    }

    async createQualification(dto: QualificationDto) {
        try {
            const qual = await this.db.qualification.create({
                data: {
                    name: dto.name,
                    year: dto.year,
                    userId: dto.userId,
                },
            });

            return QualificationDto.createFromDao(qual);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // unique field already exists
                if (error.code === "P2002") {
                    throw new ForbiddenException("Qualification could not be created");
                }
            }
            throw error;
        }
    }
    async editStatusForAConsumedUnit(userID: string, consumedUnitId: string, status: STATUS) {
        try {
            // Find users with the given learning unit in their learning history
            const user = await this.db.userProfile.findUnique({
                where: {
                    id: userID,
                },
            });

            // Update the status for each user's learning unit
            if (user) {
                await this.db.consumedUnitData.updateMany({
                    where: {
                        id: user.id,
                        consumedLUId: consumedUnitId,
                    },
                    data: {
                        status: status,
                    },
                });
                return UserDto.createFromDao(user);
            } else {
                throw new NotFoundException("User not Found in DB ");
            }
        } catch (error) {
            // Handle errors
            throw new Error(`Error updating status for users with learning unit: ${error.message}`);
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
                userProfilId: userID,
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
                    userProfilId: learningHistoryId,
                },
                include: {
                    unitSequence: true,
                },
            });

            if (!learningPath) {
                throw new Error("Learning path not found for the given learning history.");
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
            throw new Error(`Error checking status for units in the path: ${error.message}`);
        }
    }

    async updateStatusForConsumedLearningUnit(learningUnitId: string, newStatus: STATUS) {
        try {
            const learningHistories = await this.db.learningHistory.findMany({
                where: {
                    learnedSkills: {
                        some: {
                            skillId: learningUnitId,
                        },
                    },
                },
            });
            const updatedHistories = await Promise.all(
                learningHistories.map(async (history) => {
                    const consumedUnit = await this.db.consumedUnitData.findFirst({
                        include: { startedBy: true },
                        where: {
                            consumedLUId: learningUnitId,
                            startedBy: {
                                some: {
                                    id: history.id,
                                },
                            },
                        },
                    });

                    if (consumedUnit) {
                        await this.db.consumedUnitData.update({
                            where: {
                                id: consumedUnit.id,
                            },
                            data: {
                                status: newStatus,
                            },
                        });
                    }

                    return history;
                }),
            );

            return { updatedHistories };
        } catch (error) {
            // Handle errors
            throw new Error(`Error updating status for users with learning unit: ${error.message}`);
        }
    }
}
