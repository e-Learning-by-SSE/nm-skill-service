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
    userId: string;
    
    startedLearningUnits: ConsumedUnitData[];
    
    learnedSkills: LearningProgress[];
    
    personalPaths: PersonalizedLearningPath[];

}
