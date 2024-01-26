import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

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
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { CareerProfileFilterDto } from "./dto/careerProfile-filter.dto";
import { STATUS, USERSTATUS, UserProfile } from "@prisma/client";
import { connect } from "http2";
import { JobUpdateDto } from "./dto/job-update.dto";
import { QualificationCreationDto } from "./dto/qualification-creation.dto";

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

    async createLearningHistory(historyId: string, dto: LearningHistoryCreationDto) {
        try {
            const existingLearningHistory = await this.db.learningHistory.findUnique({
                where: { id: historyId },
            });

            if (existingLearningHistory) {
                throw new ForbiddenException("Learning history already exists for the given ID");
            }

            const learningHistory = await this.db.learningHistory.create({
                data: {
                    id: historyId,
                    user: { connect: { id: dto.userId } },
                },
            });

            return LearningHistoryDto.createFromDao(learningHistory);
        } catch (error) {
            // Handle errors appropriately, log or rethrow if needed
            throw error;
        }
    }
    async getLearningHistoryById(historyId: string) {
        try {
            const profile = await this.db.learningHistory.findUnique({
                where: { id: historyId },
            });

            if (!profile) {
                throw new NotFoundException("No learning History found.");
            }

            return profile;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }

    async getLearningProfileByID(learningProfileId: string) {
        try {
            const profile = await this.db.learningProfile.findUnique({
                where: { id: learningProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No learning profile found.");
            }

            return profile;
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }
    async deleteLearningProfileByID(learningProfileId: string) {
        try {
            const profile = await this.db.learningProfile.delete({
                where: { id: learningProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No learning profile found : " + learningProfileId);
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }
    async patchLearningProfileByID(learningProfileId: string, dto: LearningProfileDto) {
        try {
            const existingLearningProfile = await this.db.learningProfile.findUnique({
                where: { id: learningProfileId },
            });

            if (!existingLearningProfile) {
                throw new NotFoundException("Learning profile not found.");
            }
            const updatedLearningProfile = await this.db.learningProfile.update({
                where: { id: learningProfileId },
                data: {
                    semanticDensity:
                        dto.semanticDensity !== undefined
                            ? Number(dto.semanticDensity)
                            : existingLearningProfile.semanticDensity,
                    semanticGravity:
                        dto.semanticGravity !== undefined
                            ? Number(dto.semanticGravity)
                            : existingLearningProfile.semanticGravity,
                    mediaType: dto.mediaType || existingLearningProfile.mediaType,
                    language: dto.language || existingLearningProfile.language,
                    processingTimePerUnit:
                        dto.processingTimePerUnit || existingLearningProfile.processingTimePerUnit,
                },
            });

            return LearningProfileDto.createFromDao(updatedLearningProfile);
        } catch (error) {
            throw error;
        }
    }
    async patchCareerProfileByID(careerProfileId: string, dto: CareerProfileCreationDto) {
        try {
            const existingCareerProfile = await this.db.careerProfile.findUnique({
                where: {
                    id: careerProfileId,
                },include:{jobHistory:true}
            });

            if (!existingCareerProfile) {
                throw new NotFoundException("Career profile not found.");
            }
         
            const updatedCareerProfile = await this.db.careerProfile.update({
                where: {
                    id: careerProfileId,
                },
                data: {
                    professionalInterests:
                        dto.professionalInterests || existingCareerProfile.professionalInterests,
                    currentJobIdAtBerufeNet:
                        dto.currentJobIdAtBerufeNet ||
                        existingCareerProfile.currentJobIdAtBerufeNet,
                    selfReportedSkills: {
                        connect: dto.selfReportedSkills.map((id) => ({ id })),
                    },
                    verifiedSkills: {
                        connect: dto.verifiedSkills.map((id) => ({ id })),
                    },
                    ...(dto.currentCompanyId
                        ? {
                              currentCompany: {
                                  connect: { id: dto.currentCompanyId },
                              },
                          }
                        : {}),
                    ...(dto.userId ? { user: { connect: { id: dto.userId } } } : {}),
                    jobHistory: {
                
                        upsert: dto.jobHistory?.map((job) => ({
                            where: { id: job.id || undefined },
                            create: {
                              
                                jobTitle: job.jobTitle,
                                userId: job.userId,
                                companyId:job.companyId,
                                startTime: job.startTime,
                                endTime: job.endTime
                            },
                            update: {
                                jobTitle: job.jobTitle,
                                userId: job.userId,
                                companyId:job.companyId,
                                startTime: job.startTime,
                                endTime: job.endTime
                            },
                        })),
                    },
                    qualifications: {
                        upsert: dto.qualifications?.map((qualification) => ({
                            where: { id: qualification.id || undefined },
                            create: {
                                name: qualification.name,
                                year: qualification.year,
                                userId:qualification.careerProfileId
                            },
                            update: {
                                name: qualification.name,
                                year: qualification.year,
                                userId:qualification.careerProfileId
                            },
                        })),
                    },
                    
                },
            });
            const careerProfileDto = CareerProfileDto.createFromDao(updatedCareerProfile);

            return careerProfileDto;
        } catch (error) {
            throw new Error(`Error patching career profile by ID: ${error.message}`);
        }
    }

    async deleteCareerProfileByID(careerProfileId: string) {
        try {
            const profile = await this.db.careerProfile.delete({
                where: { id: careerProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No careerProfile found.");
            }

            return CareerProfileDto.createFromDao(profile);
        } catch (error) {
            throw error;
        }
    }

    async getCareerProfileByID(careerProfileId: string) {
        try {
            const profile = await this.db.careerProfile.findUnique({
                where: { id: careerProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No careerProfile found.");
            }

            return CareerProfileDto.createFromDao(profile);
        } catch (error) {
            // Handle any other errors or rethrow them as needed
            throw error;
        }
    }
    async getCareerProfileByFilter(filter: CareerProfileFilterDto): Promise<any> {
        try {
            if (filter.userId && filter.userId.length != 0) {
                // Use Prisma's findUnique method to retrieve a user based on the provided filter
                const career = await this.db.careerProfile.findUnique({
                    where: {
                        // Only include the filter property if it is provided in the DTO
                        userId: filter.userId,
                    },
                });

                if (!career) {
                    throw new NotFoundException("User not found.");
                }

                return CareerProfileDto.createFromDao(career);
            } else {
                const career = await this.db.careerProfile.findMany();

                if (!career) {
                    throw new NotFoundException("User not found.");
                }

                const careerProfileDtos: CareerProfileDto[] = [];
                career.forEach((element) => {
                    careerProfileDtos.push(CareerProfileDto.createFromDao(element));
                });
                return careerProfileDtos;
            }
        } catch (error) {
            // Handle errors appropriately, you can log or rethrow the error
            throw new Error(`Error getting user by filter: ${error.message}`);
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

    async deleteJobHistoryAtCareerProfileByID(careerProfileId: string, jobHistoryId: string) {
        try {
            const careerProfile = await this.db.careerProfile.findUnique({
                where: { id: careerProfileId },
            });

            if (!careerProfile) {
                throw new NotFoundException("Career profile not found");
            }
            const jobHistory = await this.db.job.findUnique({
                where: { id: jobHistoryId },
            });

            if (!jobHistory) {
                throw new NotFoundException("Job history entry not found");
            }

            await this.db.job.delete({
                where: { id: jobHistoryId },
            });

            return { success: true, message: "Job history entry deleted successfully" };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
            }
            throw error;
        }
    }
    async patchJobHistoryAtCareerProfileByID(
        careerProfileId: string,
        jobHistoryId: string,
        dto: JobUpdateDto,
    ) {
        try {
            const careerProfile = await this.db.careerProfile.findUnique({
                where: { id: careerProfileId },
            });

            if (!careerProfile) {
                throw new NotFoundException("Career profile not found");
            }

            const jobHistory = await this.db.job.findUnique({
                where: { id: jobHistoryId },
            });

            if (!jobHistory) {
                throw new NotFoundException("Job history entry not found");
            }

            const updatedJobHistory = await this.db.job.update({
                where: { id: jobHistoryId },
                data: {
                    endTime: dto.endTime || jobHistory.endTime,
                    startTime: dto.startTime || jobHistory.startTime,
                    jobTitle: dto.jobTitle || jobHistory.jobTitle,
                    jobIdAtBerufeNet: dto.jobIdAtBerufeNet || jobHistory.jobIdAtBerufeNet,
                },
            });

            return updatedJobHistory;
        } catch (error) {
            throw error;
        }
    }

    async createJob(id: string, dto: JobCreationDto) {
        // Create and return a Job
        try {
            const jb = await this.db.job.create({
                data: {
                    jobTitle: dto.jobTitle,
                    startTime: dto.startTime,
                    endTime: dto.endTime,
                    companyId: dto.companyId,
                    userId: id,
                    jobIdAtBerufeNet: dto.jobIdAtBerufeNet,
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
                    processingTimePerUnit: dto.processingTimePerUnit,
                    preferredDidacticMethod: dto.preferredDidacticMethod,
                    id: dto.userId,
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
                    currentJobIdAtBerufeNet: dto.currentJobIdAtBerufeNet,

                    user: {
                        connect: {
                            id: dto.userId,
                        },
                    },
                    currentCompany: {
                        connect: {
                            id: dto.currentCompanyId,
                        },
                    },
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

    async createQualificationForCareerProfile(id: string, dto: QualificationDto) {
        try {
            // Ensure that the user with the given ID exists
            const user = await this.db.userProfile.findUnique({
                where: { id },
            });

            if (!user) {
                throw new BadRequestException("User not found");
            }
            const profile = await this.db.careerProfile.create({
                data: {
                    userId:user.id,
                    id:user.id,
                     // Associate the qualification with the user
                },
            });
            console.log(profile);
            const qualification = await this.db.qualification.create({
                data: {
                    name: dto.name,
                    year: dto.year,
                    careerProfile: { connect: { userId:user.id,  } }, // Associate the qualification with the user
                },
            });
            console.log(qualification);
            return QualificationDto.createFromDao(qualification);
        } catch (error) {
            throw new BadRequestException(`Failed to create qualification: ${error.message}`);
        }
    }
    
    async deleteQualificationForCareerProfile(careerProfileId: string, qualificationId: string) {
        try {
            const qualification = await this.db.qualification.findUnique({
                where: { id: qualificationId, careerProfileId: careerProfileId },
            });

            if (!qualification) {
                throw new NotFoundException("Qualification not found");
            }
            const deletedQualification = await this.db.qualification.delete({
                where: {
                    id: qualificationId,
                },
            });

            if (!deletedQualification) {
                throw new BadRequestException("Qualification not found for deletion.");
            }

            return QualificationDto.createFromDao(deletedQualification);
        } catch (error) {
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException(`Validation error: ${error.message}`);
            }
            throw new BadRequestException(`Failed to delete qualification: ${error.message}`);
        }
    }
    async patchQualificationForCareerProfile(
        careerProfileId: string,
        qualificationId: string,
        dto: QualificationCreationDto,
    ) {
        try {
            // Check if the qualification exists
            const existingQualification = await this.db.qualification.findUnique({
                where: {
                    id: qualificationId,
                    careerProfileId: careerProfileId,
                },
            });
    
            if (!existingQualification) {
                throw new NotFoundException("Qualification not found for update.");
            }
    
            // Check if the careerProfileId in dto is provided and exists
            const newCareerProfileId = dto.userCareerProfileId;
            const careerProfileExists = newCareerProfileId
                ? await this.db.careerProfile.findUnique({
                      where: { id: newCareerProfileId },
                  })
                : true; // If not provided, assume it's valid
    
            if (!careerProfileExists) {
                throw new NotFoundException("Career profile not found.");
            }
    
            // Update the qualification
            const updatedQualification = await this.db.qualification.update({
                where: {
                    id: qualificationId,
                    careerProfileId: careerProfileId,
                },
                data: {
                    name: dto.name || existingQualification.name,
                    year: dto.year || existingQualification.year,
                   
                    
                    careerProfile: dto.userCareerProfileId
                    ? { connect: { id: dto.userCareerProfileId } }
                    : undefined,
          
                },
            });
    
            return QualificationDto.createFromDao(updatedQualification);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException("Qualification not found");
            }
    
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException(`Validation error: ${error.message}`);
            }
    
            throw new BadRequestException(`Failed to update qualification: ${error.message}`);
        }
    }
    async getQualificationForCareerProfile(qualificationId: string) {
        try {
            const qualification = await this.db.qualification.findUnique({
                where: {
                    id: qualificationId,
                },
            });

            if (!qualification) {
                throw new BadRequestException("Qualification not found.");
            }

            return QualificationDto.createFromDao(qualification);
        } catch (error) {
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestException(`Validation error: ${error.message}`);
            }
            throw new BadRequestException(`Failed to retrieve qualification: ${error.message}`);
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
                    status:  userState,     //Only change the state
                },

            });
            return updatedUser;
        } catch (error) {
            throw new ForbiddenException("User could not be updated (non-existing user)");
        }
    }
}
