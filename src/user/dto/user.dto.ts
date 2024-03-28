import { IsNotEmpty, IsOptional } from "class-validator";
import {
    CareerProfile,
    ConsumedUnitData,
    LearningHistory,
    LearningProfile,
    LearningProgress,
    PersonalizedLearningPath,
    USERSTATUS,
    UserProfile,
} from "@prisma/client";
import { LearningProfileDto } from "../learningProfileService/dto/learningProfile.dto";
import { CareerProfileDto } from "../careerProfileService/dto/careerProfile.dto";
import { LearningHistoryDto } from "../learningHistoryService/dto";

/**
 * DTO for retrieving a complete user profile.
 * Contains all relevant information about a user.
 * @author Sauer, Gerling
 */
export class UserDto {
    @IsNotEmpty()
    id: string; //The unique id of the user, set by MLS
    @IsOptional()
    learningProfile?: LearningProfileDto; //Contains the learning preferences of a user
    @IsOptional()
    careerProfile?: CareerProfileDto; //Contains the past jobs and self-reported skills of a user
    @IsOptional()
    learningHistory?: LearningHistoryDto; //Contains the learned skills, their date, and the consumed learning units
    status: USERSTATUS; // (active, inactive)  value set by User-Events (create / delete), default value is "active"

    static createFromDao(
        //This part is coming from the DB
        user: UserProfile & {
            learningProfile?: LearningProfile;
            careerProfile?: CareerProfile;
            learningHistory?: LearningHistory & {
                startedLearningUnits: ConsumedUnitData[];
                learnedSkills: LearningProgress[];
                personalPaths: PersonalizedLearningPath[];
            }
        },
        //This is what we return (a dto object with the same structure as the DB object)
    ): UserDto {
        return {
            id: user.id,
            //Either create optional attributes as DTOs or leave them undefined
            learningProfile: user.learningProfile
                ? LearningProfileDto.createFromDao(user.learningProfile)
                : undefined,
            careerProfile: user.careerProfile
                ? CareerProfileDto.createFromDao(user.careerProfile)
                : undefined,
            learningHistory: user.learningHistory
                ? LearningHistoryDto.createFromDao(user.learningHistory)
                : undefined,
            status: user.status as USERSTATUS,
        };
    }
}
