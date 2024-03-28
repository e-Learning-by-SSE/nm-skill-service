import { IsNotEmpty, IsString } from "class-validator";

/**
 * This models a subset of the learning progress object used for its creation (as we only need to set a subset of the attributes)
 */
export class LearningProgressCreationDto {

    // The ID of the skill object for which learning progress is being recorded
    @IsNotEmpty({message: 'Skill id must not be empty' })
    @IsString({message: 'Skill id must be a valid string' })
    skillId: string; 

    //Learned skills are part of the learning history object of a user
    @IsNotEmpty({message: 'learningHistory id must not be empty' })
    learningHistoryId: string;

}
