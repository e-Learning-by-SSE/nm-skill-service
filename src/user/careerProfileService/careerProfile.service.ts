import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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
                    jobHistory: {
                        orderBy: {
                            startTime: "asc",
                        },
                    },
                    qualifications: {
                        orderBy: {
                            date: "asc",
                        },
                    },
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
        const careerProfile = await this.db.careerProfile.findUnique({
            where: {
                userId: careerProfileId,
            },
            include: {
                jobHistory: {
                    orderBy: {
                        startTime: "asc",
                    },
                },
                qualifications: {
                    orderBy: {
                        date: "asc",
                    },
                },
            },
        });

        if (!careerProfile) {
            throw new NotFoundException(
                "Career profile with id " + careerProfileId + " not found.",
            );
        }

        return CareerProfileDto.createFromDao(careerProfile);
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

    /**
     * Adds a new job to the job history of the user with the specified id
     * @param careerProfileId The id of the user and its career profile (both are the same) to which the job shall be added
     * @param dto The job data to add
     * @returns A success message if successful
     */
    async addJobToJobHistoryAtCareerProfile(careerProfileId: string, dto: JobDto) {
        try {
            await this.db.job.create({
                data: {
                    id: dto.id, //Optionally used when desired, can be undefined
                    jobTitle: dto.jobTitle,
                    startTime: dto.startDate, //Expects ISO-8601 DateTime (like 2024-07-16T11:38:01.448Z)
                    endTime: dto.endDate, //Can be undefined
                    company: dto.company,
                    careerProfile: { connect: { userId: careerProfileId } },
                },
            });

            return "Successfully added job to job history of user with id: " + careerProfileId;
        } catch (error) {
            throw new ForbiddenException(`Failed to add job to job history: ${error.message}`);
        }
    }

    /**
     * Updates the values of an existing job in the job history of a user
     * @param jobId The id of the job to update
     * @param dto The new data for the job
     * @returns A success message if successful
     */
    async updateJobInCareerProfile(jobId: string, dto: JobDto) {
        try {
            await this.db.job.update({
                where: { id: jobId },
                data: {
                    endTime: dto.endDate,
                    startTime: dto.startDate,
                    jobTitle: dto.jobTitle,
                    company: dto.company,
                },
            });

            return "Successfully updated job in job history";
        } catch (error) {
            throw new ForbiddenException(`Failed to update job in job history: ${error.message}`);
        }
    }

    /**
     * Deletes a job from the job history of a user
     * @param jobId The id of the job to delete
     * @returns A success message if successful
     */
    async deleteJobFromHistoryInCareerProfile(jobId: string) {
        try {
            await this.db.job.delete({
                where: { id: jobId },
            });

            return { success: true, message: "Job history entry deleted successfully" };
        } catch (error) {
            throw new ForbiddenException(`Failed to delete job from job history: ${error.message}`);
        }
    }

    /**
     * Adds a new qualification to the career profile of a user
     * @param careerProfileId The id of the user and its career profile (both are the same) to which the qualification shall be added
     * @param dto The qualification to add
     * @returns A success message if successful
     */
    async addQualificationToCareerProfile(careerProfileId: string, dto: QualificationDto) {
        try {
            await this.db.qualification.create({
                data: {
                    id: dto.id, //Optional, can be undefined
                    title: dto.title,
                    date: dto.date,
                    careerProfile: { connect: { userId: careerProfileId } }, //Connect to career profile with the given id
                },
            });

            return "Successfully added qualification to career profile";
        } catch (error) {
            throw new ForbiddenException(`Failed to create qualification: ${error.message}`);
        }
    }

    /**
     * Updates an existing qualification in the career profile of a user
     * @param qualificationId The id of the qualification to update
     * @param dto The new data for the qualification
     * @returns A success message if successful
     */
    async updateQualificationInCareerProfile(qualificationId: string, dto: QualificationDto) {
        try {
            await this.db.qualification.update({
                where: { id: qualificationId },
                data: {
                    title: dto.title,
                    date: dto.date,
                },
            });

            return "Successfully updated qualification in career profile";
        } catch (error) {
            throw new ForbiddenException(`Failed to update qualification: ${error.message}`);
        }
    }

    /**
     * Deletes an existing qualification from the career profile of a user
     * @param qualificationId The id of the qualification to delete
     * @returns A success message if successful
     */
    async deleteQualificationFromCareerProfile(qualificationId: string) {
        try {
            await this.db.qualification.delete({
                where: { id: qualificationId },
            });

            return "Successfully deleted qualification from career profile";
        } catch (error) {
            throw new ForbiddenException(`Failed to delete qualification: ${error.message}`);
        }
    }
}
