import { IsDefined, IsNotEmpty } from "class-validator";
import {
    ConsumedUnitData,
    LearningProgress,
    UserProfile,
    LearningProfile,
    LearningHistory,
    // PersonalizedLearningPath,
} from "@prisma/client";

import { LearningHistoryCreationDto } from "./learningHistory-creation.dto";

export class LearningHistoryDto extends LearningHistoryCreationDto {
    @IsNotEmpty()
    id: string;

    constructor(
        id: string,
        startedLearningUnits: ConsumedUnitData[] | undefined,
        learnedSkills: LearningProgress[] | undefined,
        user: UserProfile | undefined,
        userId: string,
        learningProfile: LearningProfile[] | undefined,
        // personalPaths: PersonalizedLearningPath[] | undefined,
    ) {
        super();

        this.id = id;
        this.startedLearningUnits = startedLearningUnits ?? undefined;
        this.learnedSkills = learnedSkills ?? undefined;
        this.user = user ?? undefined;
        this.userId = userId;
        this.learningProfile = learningProfile ?? undefined;
        // this.personalPaths = PersonalizedLearningPath ?? undefined;
    }

    static createFromDao(lh: LearningHistory): LearningHistoryCreationDto {
        return new LearningHistoryDto(
            lh.id,
            lh.startedLearningUnits,
            lh.learnedSkills,
            lh.user,
            lh.userId,
            lh.learningProfile,
            //  lh.personalPaths,
        );
    }
}
