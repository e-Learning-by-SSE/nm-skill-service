import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsDefined } from "class-validator";
import {
    ConsumedUnitData,
    LearningProgress,
    UserProfile,
    LearningProfile,
    PersonalizedLearningPath,
} from "@prisma/client";

/**
 * Creates a new LearningHistory
 */
export class LearningHistoryCreationDto {
    @IsDefined()
    id: string;
    @IsOptional()
    startedLearningUnits?: ConsumedUnitData[];
    @IsOptional()
    learnedSkills?: LearningProgress[];
    @IsOptional()
    user?: UserProfile;
    @IsDefined()
    userId: string;
    @IsOptional()
    learningProfile?: LearningProfile[];
    @IsOptional()
    personalPaths?: PersonalizedLearningPath[];
}
