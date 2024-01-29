import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import { PrismaService } from "../prisma/prisma.service";

import { CareerProfileCreationDto } from "./dto/careerProfile-creation.dto";
import { CareerProfileDto } from "./dto/careerProfile.dto";
import { CareerProfileFilterDto} from "./dto/careerProfile-filter.dto";

import { JobCreationDto} from "../user/dto/job-creation.dto";
import { JobUpdateDto} from "../user/dto/job-update.dto";
import { JobDto} from "../user/dto/job.dto";

import { QualificationCreationDto} from "../user/dto/qualification-creation.dto";
import { QualificationDto} from "../user/dto/qualification.dto";

/**
 * Service that manages the creation/update/deletion of learningHistory
 * @author Sauer
 */
@Injectable()
export class CareerProfileService {
    constructor(private db: PrismaService) {}


    async createCareerProfile(dto: CareerProfileCreationDto) {
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
}
