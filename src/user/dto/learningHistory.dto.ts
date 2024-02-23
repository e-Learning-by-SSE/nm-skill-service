import {  IsDefined, IsNotEmpty, IsOptional  } from "class-validator";
import { LearningHistory } from "@prisma/client";
import {
    LearningProfile,
    LearningProgress,
    UserProfile,
    ConsumedUnitData,
    PersonalizedLearningPath,
} from "@prisma/client";

export class LearningHistoryDto{
    @IsNotEmpty()
    id: string;
    @IsDefined()
    userId?: string;
    @IsOptional()
    user?: UserProfile;
    @IsOptional()
    startedLearningUnits?: ConsumedUnitData[];
    @IsOptional()
    learnedSkills?: LearningProgress[];
    @IsOptional()
    learningProfile?: LearningProfile[];
    @IsOptional()
    personalPaths?: PersonalizedLearningPath[];

    constructor(
        id: string,
        userId: string,
        user?: UserProfile | null,
        startedLearningUnits?: ConsumedUnitData[] | null,
        learnedSkills?: LearningProgress[] | null,
        learningProfile?: LearningProfile[] | null,
        personalPaths?: PersonalizedLearningPath[] | null,
    ) {

        this.id = id;
        this.userId = userId;
        this.user = user ?? undefined;
        this.learningProfile = learningProfile ?? undefined;
        this.startedLearningUnits = startedLearningUnits ?? undefined;
        this.learnedSkills = learnedSkills ?? undefined;
        this.learningProfile = learningProfile ?? undefined;
        this.personalPaths = personalPaths ?? undefined;
    }

    static createFromDao(lh: LearningHistory): LearningHistoryDto {

    
        return new LearningHistoryDto(
            lh.id,
            lh.userId,
           // lh.user,                               
           // lh.startedLearningUnits,       // Die Felder sind noch nicht da, lh.meint die sind nicht im Schema
           // lh.learnedSkills,
           // lh.LearningProfile,
           // lh.personalPaths,
        );
    }
}

// Anmerkung: ToDo: 4 Ordner, in die dann userservice geht und für jeden ausgegliederten services (learningHistory, careerProfile, learningProfile)
// Als Unterordner von "user"

// Commit, asap, wenn Grundfunktion geht
