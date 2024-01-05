import { LearningPathProgress, LIFECYCLE } from "@prisma/client";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { SkillDto} from "../../skills/dto";
import { SearchLearningUnitDto } from "../../learningUnit/dto";
import { LearningHistoryDto } from "./learningHistory.dto";
import { LearningPathDto } from "../../learningPath/dto";

/**
 * Creates a new PersonalizedLearningPath.
 */
export class PersonalizedLearningPathCreationDto {
    /**
     * // SomethingDto are specifically for data(object) transfer outside the (Prisma)-DB
     */
    @IsNotEmpty()
    id: string;
    @IsOptional()
    pathTeachingGoals?: SkillDto[]; 
    @IsOptional()
    unitSequence?: SearchLearningUnitDto[];
    @IsOptional()
    userProfile?: LearningHistoryDto;  
    @IsOptional() 
    userProfileId?: string;
    @IsOptional()
    learningPath?: LearningPathDto;
    @IsOptional()
    learningPathId?: string;
    @IsOptional()
    progress?: LearningPathProgress;  // progress: LearningPathProgressDto;   // Fix to later, when dto is available
    @IsOptional()
    lifecycle?: LIFECYCLE;
    @IsNotEmpty()
    createdAt: Date;
    @IsNotEmpty()
    updatedAt: Date;
}
