import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import {
    LearningProfile,
    LearningProgress,
    UserProfile,
    ConsumedUnitData,
    PersonalizedLearningPath,
} from "@prisma/client";

/**
 * Creates a new LearningHistory
 */
export class LearningHistoryCreationDto {
    @IsNotEmpty()
    id: string;
    @IsDefined()
    userId: string;
    @IsOptional()
    user: UserProfile;
    @IsOptional()
    startedLearningUnits: ConsumedUnitData[];
    @IsOptional()
    learnedSkills: LearningProgress[];
    @IsOptional()
    learningProfile: LearningProfile[];
    @IsOptional()
    personalPaths: PersonalizedLearningPath[];
}
