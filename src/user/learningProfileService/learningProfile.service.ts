import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningProfileDto } from "./dto/learningProfile.dto";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { LearningProfileUpdateDto } from "./dto/learningProfile-update.dto";

/**
 * Service that manages the update of learningProfiles (which store the learning preferences of a user)
 * @author Sauer
 */
@Injectable()
export class LearningProfileService {
    constructor(private db: PrismaService) {}

    //LearningProfiles are initially created empty together with their user profile (via the event system)
    //Deletion of learning profiles is not planned, as they are an integral part of the user profile (which can also only be deactivated)

    /**
     * Returns the specified learningProfile as DTO.
     * @param learningProfileId The ID of the requested learningProfile (same as the user ID to which it belongs)
     * @returns Either the learningProfile with the specified ID, or an exception if it does not exist
     */
    async getLearningProfileByID(learningProfileId: string) {

            const learningProfile = await this.db.learningProfile.findUnique({
                where: { userId: learningProfileId },
            });

            if (!learningProfile) {
                throw new NotFoundException("No learning profile found with id: "+ learningProfileId);
            }

            //Return the learningProfile as DTO
            return LearningProfileDto.createFromDao(learningProfile);   
    }


    /**
     * Updates the specified learningProfile according to the DTO.
     * @param dto A complete or partial learningProfile with the new values
     * @returns Success if successful, or an exception if the learningProfile does not exist
     */
    async updateLearningProfile(dto: LearningProfileUpdateDto) {

            //Check values again
            if (dto.semanticDensity && (dto.semanticDensity < 0 || dto.semanticDensity > 1)) {
                throw new Error("semanticDensity must be between 0 and 1");
            }
            if (dto.semanticGravity && (dto.semanticGravity < 0 || dto.semanticGravity > 1)) {
                throw new Error("semanticGravity must be between 0 and 1");
            }
            if (dto.processingTimePerUnit && (dto.processingTimePerUnit < 0 || dto.processingTimePerUnit % 1 !== 0)) {
                throw new Error("processingTimePerUnit must be at least 0 and a whole number (minutes)");
            }

            //Update the learningProfile with the specified ID according to the DTO
            const updatedLearningProfile = await this.db.learningProfile.update({
                where: { userId: dto.id },
                //Only update the fields contained in the DTO
                data: {
                    semanticDensity: dto.semanticDensity || undefined,
                    semanticGravity: dto.semanticGravity || undefined,
                    mediaType: dto.mediaType || undefined,
                    language: dto.language || undefined,
                    processingTimePerUnit: dto.processingTimePerUnit || undefined,
                    preferredDidacticMethod: dto.preferredDidacticMethod || undefined,      
                },
            });

            if (!updatedLearningProfile) {
                throw new NotFoundException("Learning profile with id: "+dto.id+" not found.");
            }

            return "Success!";
    }
}
