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
import { PrismaService } from "../../prisma/prisma.service";
import { CareerProfileDto } from "./dto/careerProfile.dto";
import { CareerProfileFilterDto } from "./dto/careerProfile-filter.dto";
import { JobDto } from "./dto/job.dto";
import { QualificationDto } from "./dto/qualification.dto";

/**
 * Service that manages the creation/update/deletion of careerProfile
 * @author Sauer
 */
@Injectable()
export class CareerProfileService {
    constructor(private db: PrismaService) {}

    async createCareerProfile(dto: CareerProfileDto) {
        try {
            const cp = await this.db.careerProfile.create({
                data: {
                    userId: dto.id,
                    professionalInterests: dto.professionalInterests,
                   //TODO: Complete


                },
            });

            return "WIP" //CareerProfileDto.createFromDao(cp);
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

    async patchCareerProfileByID(careerProfileId: string, dto: CareerProfileDto) {
        try {
            const existingCareerProfile = await this.db.careerProfile.findUnique({
                where: {
                    userId: careerProfileId,
                },
                include: { jobHistory: true },
            });

            if (!existingCareerProfile) {
                throw new NotFoundException("Career profile not found.");
            }

            const updatedCareerProfile = await this.db.careerProfile.update({
                where: {
                    userId: careerProfileId,
                },
                data: {
                    professionalInterests:
                        dto.professionalInterests || existingCareerProfile.professionalInterests,
                    
                    selfReportedSkills: dto.selfReportedSkills || undefined,
                
                   
            
                    jobHistory: {
                        upsert: dto.jobHistory?.map((job) => ({
                            where: { id: job.id || undefined },
                            create: {
                                jobTitle: job.jobTitle,
                                id: job.id,
                                company: job.company,
                                startTime: job.startDate,
                                endTime: job.endDate,
                            },
                            update: {
                                jobTitle: job.jobTitle,
                                id: job.id,
                                company: job.company,
                                startTime: job.startDate,
                                endTime: job.endDate,
                            },
                        })),
                    },
                    qualifications: {
                        upsert: dto.qualifications?.map((qualification) => ({
                            where: { id: qualification.id || undefined },
                            create: {
                                title: qualification.title,
                                date: qualification.date,


                            },
                            update: {
                                title: qualification.title,
                                date: qualification.date,

                            },
                        })),
                    },
                },
            });
            //const careerProfileDto = CareerProfileDto.createFromDao(updatedCareerProfile);

            return "WIP" //careerProfileDto;
        } catch (error) {
            throw new Error(`Error patching career profile by ID: ${error.message}`);
        }
    }

    async deleteCareerProfileByID(careerProfileId: string) {
        try {
            const profile = await this.db.careerProfile.delete({
                where: { userId: careerProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No careerProfile found.");
            }

            return "WIP" //CareerProfileDto.createFromDao(profile);
        } catch (error) {
            throw error;
        }
    }

    async getCareerProfileByID(careerProfileId: string) {
        try {
            const profile = await this.db.careerProfile.findUnique({
                where: { userId: careerProfileId },
            });

            if (!profile) {
                throw new NotFoundException("No careerProfile found.");
            }

            return "WIP" //CareerProfileDto.createFromDao(profile);
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

                return "WIP" //CareerProfileDto.createFromDao(career);
            } else {
                const career = await this.db.careerProfile.findMany();

                if (!career) {
                    throw new NotFoundException("User not found.");
                }

                const careerProfileDtos: CareerProfileDto[] = [];
                //career.forEach((element) => {
                //    careerProfileDtos.push(CareerProfileDto.createFromDao(element));
                //});
                return careerProfileDtos;
            }
        } catch (error) {
            // Handle errors appropriately, you can log or rethrow the error
            throw new Error(`Error getting user by filter: ${error.message}`);
        }
    }

    async createJob(id: string, dto: JobDto) {
        // Create and return a Job
        try {
            const jb = await this.db.job.create({
                data: {
                    jobTitle: dto.jobTitle,
                    startTime: dto.startDate,
                    endTime: dto.endDate,
                    company: dto.company,
                    careerProfile: { connect: { userId: id }
                },
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
        dto: JobDto,
    ) {
        try {
            const careerProfile = await this.db.careerProfile.findUnique({
                where: { userId: careerProfileId },
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
                    endTime: dto.endDate || jobHistory.endTime,
                    startTime: dto.startDate || jobHistory.startTime,
                    jobTitle: dto.jobTitle || jobHistory.jobTitle,
                    company: dto.company || jobHistory.company,
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
                where: { userId: careerProfileId },
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
                    userId: user.id,
                    // Associate the qualification with the user
                },
            });
            console.log(profile);
            const qualification = await this.db.qualification.create({
                data: {
                    title: dto.title,
                    date: dto.date,
                    careerProfile: { connect: { userId: user.id } }, // Associate the qualification with the user
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
        dto: QualificationDto,
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
            const careerProfileExists = careerProfileId
                ? await this.db.careerProfile.findUnique({
                      where: { userId: careerProfileId },
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
                    title: dto.title || existingQualification.title,
                    date: dto.date || existingQualification.date,
                }

            });

            return QualificationDto.createFromDao(updatedQualification);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
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
