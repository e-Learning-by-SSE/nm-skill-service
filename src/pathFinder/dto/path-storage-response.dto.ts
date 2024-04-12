import {
    LIFECYCLE,
    LearningHistory,
    LearningUnit,
    PersonalizedLearningPath,
    Skill,
    UserProfile,
    STATUS,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

/**
 * Response to the request of storing a personal path of an learner.
 */
export class PathStorageResponseDto {
    @IsDefined()
    userId: string;

    @IsDefined()
    learningHistoryId: string;

    @IsDefined()
    pathId: string;

    /**
     * The personalized path of the learner to be stored.
     */
    @IsDefined()
    @IsNotEmpty()
    units: string[];

    /**
     * The pre-defined learning path which was personalized for the learner.
     * Optional, if the path was selected based on a pre-defined learning paths.
     */
    @IsOptional()
    originPathId?: string;

    /**
     * The learning goals of the path.
     */
    @IsDefined()
    @IsNotEmpty()
    goal: string[];

    @IsDefined()
    lifecycle: LIFECYCLE;

    static createFromDao(
        dao: PersonalizedLearningPath & {
            unitSequence: {
                id: string;
                position: number;
                unit: {
                    id: string;
                    actualProcessingTime: number;
                    testPerformance: Decimal;
                    unitId: string;
                    lbDataId: string | null;
                    status: STATUS;
                    date: Date;
                    historyId: string;
                };
            }[];
            pathTeachingGoals: Skill[];
            learningHistory: LearningHistory & { user: UserProfile };
        },
    ): PathStorageResponseDto {
        const dto: PathStorageResponseDto = {
            userId: dao.learningHistory.userId,
            learningHistoryId: dao.learningHistory.userId,
            pathId: dao.id,
            units: dao.unitSequence.map((u) => u.id),
            originPathId: dao.learningPathId ?? undefined,
            goal: dao.pathTeachingGoals.map((t) => t.id),
            lifecycle: dao.lifecycle,
        };

        return dto;
    }
}
