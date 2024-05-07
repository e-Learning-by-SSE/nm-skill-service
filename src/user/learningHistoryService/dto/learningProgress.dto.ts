import { IsNotEmpty, IsString } from "class-validator";
import { LearnedSkill } from "@prisma/client";

/**
 * This models the complete learning progress object.
 */
export class LearnedSkillDto {

    //Automatically set in the DB
    @IsNotEmpty()
    @IsString()
    id: string;

    // The ID of the skill object for which learning progress is being recorded
    @IsNotEmpty()
    @IsString()
    skillId: string; 

    //Automatically set in the DB
    @IsNotEmpty()
    createdAt: Date;

    //Learned skills are part of the learning history object of a user. Id is the same as the user's id.
    @IsNotEmpty()
    learningHistoryId: string;


    /**
     * This is used to get a complete learning progress object from the DB
     * @param LearningProgress 
     * @returns A learning progress DTO
     */
    static createFromDao(learningProgress: LearnedSkill): LearnedSkillDto {
        return {
            id: learningProgress.id,
            skillId: learningProgress.skillId,
            createdAt: learningProgress.createdAt,
            learningHistoryId: learningProgress.learningHistoryId
        };    
    }

}
