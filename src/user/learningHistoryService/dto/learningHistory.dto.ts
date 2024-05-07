import { IsNotEmpty } from "class-validator";
import {
    LearnedSkill,
    LearningHistory,
    PersonalizedLearningPath,
} from "@prisma/client";

export class LearningHistoryDto {
    @IsNotEmpty()
    id: string;
    learnedSkills: string[];
    personalPaths: string[];

    static createFromDao(
        learningHistory: LearningHistory & {
            learnedSkills: LearnedSkill[];
            personalPaths: PersonalizedLearningPath[];
        },
    ): LearningHistoryDto {
        return {
            id: learningHistory.userId,
            learnedSkills: learningHistory.learnedSkills?.map((element) => element.id) ?? [],
            personalPaths: learningHistory.personalPaths?.map((element) => element.id) ?? [],
        };
    }
}
