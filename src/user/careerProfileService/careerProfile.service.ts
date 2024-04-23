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
import { JobDto } from "./dto/job.dto";
import { QualificationDto } from "./dto/qualification.dto";
import { CareerProfileUpdateDto } from "./dto/careerProfileUpdate.dto";

/**
 * Service that manages the creation/update/deletion of careerProfiles and their child objects
 * @author Sauer, Gerling
 */
@Injectable()
export class CareerProfileService {
    constructor(private db: PrismaService) {}

    /**
     * Returns all career profiles (including child objects) of all users
     * @returns A list of all career profiles (including child objects) of all users
     */
    async getAllCareerProfiles() {
        try {
            const profiles = await this.db.careerProfile.findMany({
                include: {
                    jobHistory: true,
                    qualifications: true,
                },
            });

            return profiles.map((profile) => CareerProfileDto.createFromDao(profile));
        } catch (error) {
            throw new ForbiddenException(`Error retrieving career profiles: ${error.message}`);
        }
    }

    /**
     * Returns the career profile of the user with the specified id (which is the same as the career profile id)
     * @param careerProfileId The id of the user whose career profile shall be retrieved
     * @returns A career profile DTO for the specified user (and with the specified career profile id)
     */
    async getCareerProfileByID(careerProfileId: string) {
        try {
            const careerProfile = await this.db.careerProfile.findUnique({
                where: {
                    userId: careerProfileId,
                },
                include: {
                    jobHistory: true,
                    qualifications: true,
                },
            });

            if (!careerProfile) {
                throw new NotFoundException("Career profile with id "+careerProfileId+" not found.");
            }

            return CareerProfileDto.createFromDao(careerProfile);
        } catch (error) {   
            throw new ForbiddenException(`Error retrieving career profile by ID: ${error.message}`);
        }
    }

    
    /**
     * Update the non-object values of the career profile (of the user) with the specified id
     * @param id The id of the user whose career profile shall be updated
     * @param dto The career profile update DTO with the new values
     * @returns The updated career profile
     */
    async patchCareerProfileByID(id: string, dto: CareerProfileUpdateDto) {
        try {
            const updatedCareerProfile = await this.db.careerProfile.update({
                where: { userId: id },
                data: {
                    professionalInterests: dto.professionalInterests,
                    selfReportedSkills: dto.selfReportedSkills,
                },
            });

            return updatedCareerProfile;
        } catch (error) {
            throw new ForbiddenException(`Error updating career profile by ID: ${error.message}`);
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

    async createQualificationForCareerProfile(dto: QualificationDto) {
        try {            
            const qualification = await this.db.qualification.create({
                data: {
                    id: dto.id,     //Do we want to set the id ourselves?
                    title: dto.title,
                    date: dto.date,
                    careerProfile: { connect: { userId: dto.id }} //Connect to career profile (TDB)
                },
            });

            return QualificationDto.createFromDao(qualification);
        } catch (error) {
            throw new BadRequestException(`Failed to create qualification: ${error.message}`);
        }
    }

    async deleteQualificationForCareerProfile(qualificationId: string) {
        try {
            const deletedQualification = await this.db.qualification.delete({
                where: {
                    id: qualificationId,
                },
            });

            if (!deletedQualification) {
                throw new BadRequestException("Qualification not found for deletion.");
            }

            return "Successfully deleted qualification with id: ${qualificationId}";
        } catch (error) {
            console.error(error);
            return "Failed to delete qualification with id: ${qualificationId}"
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
