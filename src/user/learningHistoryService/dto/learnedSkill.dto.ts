import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * Models a learned skill: mapping between skill and user (learning history)
 * This model is currently only used for saving learned skills in the database.
 */
export class LearnedSkillDto {
    //Automatically set in the DB (this is not required in the DTO, as we do not always need it)
    @IsOptional()
    @IsString()
    id?: string;

    // The ID of the skill object for which learning progress is being recorded
    @IsNotEmpty({ message: "Skill id must not be empty" })
    @IsString({ message: "Skill id must be a valid string" })
    skillId: string;

    //Automatically set in the DB (this is not required in the DTO, as we do not always need it)
    @IsOptional()
    @IsDate()
    createdAt?: Date;

    //Learned skills are part of the learning history object of a user. Id is the same as the user's id.
    @IsNotEmpty({ message: "learningHistory id must not be empty" })
    @IsString()
    learningHistoryId: string;

}
