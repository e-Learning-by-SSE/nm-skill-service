import { IsNotEmpty } from "class-validator";
import {
    LearningPathProgress,
    PersonalizedLearningPath,
    LIFECYCLE,
} from "@prisma/client";
import { PersonalizedLearningPathCreationDto } from "./personalizedLearningPath-creation.dto";
import { SkillDto } from "../../skills/dto/skill.dto";
import { SearchLearningUnitDto } from "../../learningUnit/dto/learningUnit.dto";
import { LearningHistoryDto } from "./learningHistory.dto";
import { LearningPathDto } from "../../learningPath/dto/learningPath.dto";

export class PersonalizedLearningPathDto extends PersonalizedLearningPathCreationDto {
    @IsNotEmpty()
    id: string;

    constructor(
        id: string,
        pathTeachingGoals: SkillDto[],
        unitSequence: SearchLearningUnitDto[],
        userProfile: LearningHistoryDto,
        userProfileId: string,
        learningPath: LearningPathDto,
        learningPathId: string,
        progress: LearningPathProgress,
        lifecycle: LIFECYCLE,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super();
            this.id = id;
            this.pathTeachingGoals = pathTeachingGoals ?? undefined;
            this.unitSequence = unitSequence ?? undefined;
            this.userProfile = userProfile ?? undefined;
            this.userProfileId = userProfileId ?? undefined;
            this.learningPath = learningPath ?? undefined;
            this.learningPathId = learningPathId ?? undefined;
            this.progress = progress ?? undefined;
            this.lifecycle = lifecycle ?? undefined;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        
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
