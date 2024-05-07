import { IsNotEmpty } from "class-validator";

/**
 * Creates a new LearningHistory
 */
export class LearningHistoryCreationDto {

    @IsNotEmpty()
    userId: string;
    
    learnedSkills: string[];
    
    personalPaths: string[];

}
