import { IsNotEmpty } from "class-validator";
import {
    LearningProgress,

    ConsumedUnitData,
    PersonalizedLearningPath,
} from "@prisma/client";

/**
 * Creates a new LearningHistory
 */
export class LearningHistoryCreationDto {

    @IsNotEmpty()
    userId: string;
    
    startedLearningUnits: string[];
    
    learnedSkills: string[];
    
    personalPaths: string[];

}
