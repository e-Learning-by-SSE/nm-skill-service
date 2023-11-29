import { IsDefined, IsNotEmpty, IsDate } from "class-validator";
import {
    Skill,
    LearningHistory,
    LearningUnit,
    LearningPath,
    LearningPathProgress,
    PersonalizedLearningPath,
    LIFECYCLE,
} from "@prisma/client";
import { OmitType } from "@nestjs/swagger";
import { PersonalizedLearningPathCreationDto } from "./personalizedLearningPath-creation.dto";

export class PersonalizedLearningPathDto extends PersonalizedLearningPathCreationDto {
    @IsNotEmpty()
    id: string;

    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;

    constructor(
        id: string,
        pathTeachingGoals: Skill[],
        unitSequence: LearningUnit[],
        userProfile: LearningHistory,
        userProfileId: string,
        learningPath: LearningPath,
        learningPathId: string,
        progress: LearningPathProgress,
        lifecycle: LIFECYCLE,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(
            id,
            pathTeachingGoals,
            unitSequence,
            userProfile,
            userProfileId,
            learningPath,
            learningPathId,
            progress,
            lifecycle,
        );

        this.createdAt = createdAt.toISOString();
        this.updatedAt = updatedAt.toISOString();
    }

    static createFromDao(plp: PersonalizedLearningPath): PersonalizedLearningPathCreationDto {
        const result: PersonalizedLearningPathDto = { 
            id : plp.id,
            pathTeachingGoals: plp.pathTeachingGoals,
            unitSequence: plp.unitSequence,
            plp.userProfile,
            plp.userProfileId,
            plp.learningPath,
            plp.learningPathId,
            plp.progress,
            plp.lifecycle,
            plp.createdAt,
            plp.updatedAt,
        };
return result;
    }
}
