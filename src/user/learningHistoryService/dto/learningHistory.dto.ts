import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { LearningHistory } from "@prisma/client";
import {
    LearningProfile,
    LearningProgress,
    UserProfile,
    ConsumedUnitData,
    PersonalizedLearningPath,
} from "@prisma/client";

export class LearningHistoryDto {
    @IsNotEmpty()
    id: string;
    @IsDefined()
    userId?: string;
    @IsOptional()
    user?: UserProfile;
    @IsOptional()
    startedLearningUnits?: string[]; //// ConsumedUnitData
    @IsOptional()
    learnedSkills?: string[];
    @IsOptional()
    learningProfile?: string[];
    @IsOptional()
    personalPaths?: string[];

    constructor(
        id: string,
        userId: string,
        user?: UserProfile | null,
        startedLearningUnits?: string[] | null,
        learnedSkills?: string[] | null,
        learningProfile?: string[] | null,
        personalPaths?: string[] | null,
    ) {
        this.id = id;
        this.userId = userId;
        this.user = user ?? undefined;
        this.learningProfile = learningProfile ?? undefined;
        this.startedLearningUnits = startedLearningUnits ?? undefined;
        this.learnedSkills = learnedSkills ?? undefined;
        this.personalPaths = personalPaths ?? undefined;
    }

    static createFromDao(
        lh: LearningHistory,
        user?: UserProfile,
        learningProfile?: LearningProfile[],
        startedLearningUnits?: ConsumedUnitData[],
        learnedSkills?: LearningProgress[],
        personalPaths?: PersonalizedLearningPath[],
    ): LearningHistoryDto {
        const learningProfileUnitsAsArrayOfIds =
            learningProfile?.map((element) => element.id) || [];
        const startedLearningUnitsAsArrayOfIds =
            startedLearningUnits?.map((element) => element.id) || [];
        const learnedSkillsAsArrayOfIds = learnedSkills?.map((element) => element.id) || [];
        const personalPathsAsArrayOfIds = personalPaths?.map((element) => element.id) || [];

        return new LearningHistoryDto(
            lh.id,
            lh.userId,
            user,
            learningProfileUnitsAsArrayOfIds,
            startedLearningUnitsAsArrayOfIds,
            learnedSkillsAsArrayOfIds,
            personalPathsAsArrayOfIds,
        );
    }
}

// Anmerkung: ToDo: 4 Ordner, in die dann userservice geht und für jeden ausgegliederten services (learningHistory, careerProfile, learningProfile)
// Als Unterordner von "user"

// Commit, asap, wenn Grundfunktion geht
