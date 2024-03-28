import { IsNotEmpty } from "class-validator";
import {
    ConsumedUnitData,
    LearningHistory,
    LearningProgress,
    PersonalizedLearningPath,
} from "@prisma/client";

export class LearningHistoryDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    userId: string;
    startedLearningUnits: string[];
    learnedSkills: string[];
    personalPaths: string[];

    static createFromDao(
        learningHistory: LearningHistory & {
            startedLearningUnits: ConsumedUnitData[];
            learnedSkills: LearningProgress[];
            personalPaths: PersonalizedLearningPath[];
        },
    ): LearningHistoryDto {
        return {
            id: learningHistory.id,
            userId: learningHistory.userId,
            startedLearningUnits: learningHistory.startedLearningUnits?.map((element) => element.id) ?? [],
            learnedSkills: learningHistory.learnedSkills?.map((element) => element.id) ?? [],
            personalPaths: learningHistory.personalPaths?.map((element) => element.id) ?? [],
        };
    }
}
