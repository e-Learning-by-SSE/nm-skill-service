import { IsNotEmpty, IsOptional } from "class-validator";
import { LearningProgressCreationDto } from "./learningProgressCreation.dto";
import { LearningProgress } from "@prisma/client";

/**
 * This models the complete learning progress object.
 */
export class LearningProgressDto extends LearningProgressCreationDto {

    //Automatically set in the DB
    id: string;

    // The ID of the skill for which learning progress is being recorded
    @IsNotEmpty()
    skillId: string; 

    // The ID of the user who acquired the skill
    @IsNotEmpty()
    userId: string; 

    //Automatically set in the DB
    createdAt: Date;

    //ToDo: How to handle relation of learning progress to learning history? A progress is always part of the history, isn't it?
    @IsOptional()
    learningHistoryId?: string;


    constructor(id: string, createdAt: Date, skillId: string, userId: string, learningHistoryId?: string){
        super(skillId, userId, learningHistoryId);
        this.id = id;
        this.createdAt = createdAt;
    }

    /**
     * This is used to get a complete learning progress object from the DB
     * @param LearningProgress 
     * @returns A learning progress DTO
     */
    static createFromDB(lProgress: LearningProgress): LearningProgressDto {
        //Creates object based on prisma model
        return new LearningProgressDto(
            lProgress.id,
            lProgress.createdAt,
            lProgress.skillId,
            lProgress.userId,
            lProgress.learningHistoryId ?? undefined
        );
    }

}
