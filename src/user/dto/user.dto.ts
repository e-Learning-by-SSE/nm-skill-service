import { IsNotEmpty, IsOptional } from "class-validator";
import { USERSTATUS, UserProfile } from "@prisma/client";
import { LearningProfileDto } from "../learningProfileService/dto/learningProfile.dto";
import { CareerProfileDto } from "../careerProfileService/dto/careerProfile.dto";
import { LearningHistoryDto } from "../learningHistoryService/dto";
import { LearningBehaviorDataDto } from "./learningBehaviorData.dto";
import { LearningProgressDto } from "./learningProgress.dto";

/**
 * DTO for a user.
 * Contains all relevant information about a user.
 * @author Sauer, Gerling
 */
export class UserDto {
    @IsNotEmpty()
    id: string; //The unique id of the user, set by MLS
    @IsOptional()
    learningProfile?: LearningProfileDto;
    @IsOptional()
    careerProfile?: CareerProfileDto;
    @IsOptional()
    learningBehavior?: LearningBehaviorDataDto;
    @IsOptional()
    learningProgress?: LearningProgressDto;
    @IsOptional()
    learningHistory?: LearningHistoryDto;
    @IsOptional()
    status: USERSTATUS; // (active, inactive)  value set by User-Events (create / delete), default value is "active"

    static createFromDao(
        user: UserProfile & {
            learningProfile: LearningProfileDto;
            careerProfile: CareerProfileDto;
            learningBehavior: LearningBehaviorDataDto;
            learningProgress: LearningProgressDto;
            learningHistory: LearningHistoryDto;
        },
    ): UserDto {
        const dto: UserDto = {
            id: user.id,
            learningProfile: user.learningProfile,
            careerProfile: user.careerProfile,
            learningBehavior: user.learningBehavior,
            learningProgress: user.learningProgress,
            learningHistory: user.learningHistory,
            status: user.status,
        };
        return dto;
    }
}
