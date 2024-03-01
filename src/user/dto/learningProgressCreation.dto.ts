import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * This models a subset of the learning progress object used for its creation (as we only need to set a subset of the attributes)
 */
export class LearningProgressCreationDto {

    // The ID of the skill for which learning progress is being recorded
    @IsNotEmpty()
    skillId: string; 

    // The ID of the user who acquired the skill
    @IsNotEmpty()
    userId: string; 

    //ToDo: How to handle relation of learning progress to learning history? A progress is always part of the history, isn't it?
    @IsOptional()
    learningHistoryId?: string;

    constructor(skillId: string, userId: string, learningHistoryId?: string){
        this.skillId = skillId;
        this.userId = userId;
        this.learningHistoryId = learningHistoryId;
    }

}
