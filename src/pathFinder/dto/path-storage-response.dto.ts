import {
    LIFECYCLE,
    LearningHistory,
    LearningUnit,
    PersonalizedLearningPath,
    Skill,
    UserProfile,
} from "@prisma/client";
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
            unitSequence: LearningUnit[];
            pathTeachingGoals: Skill[];
            userProfile: LearningHistory & { user: UserProfile };
        },
    ): PathStorageResponseDto {
        const dto = new PathStorageResponseDto();
        dto.userId = dao.userProfile.userId;
        dto.learningHistoryId = dao.userProfile.id;
        dto.pathId = dao.id;
        dto.units = dao.unitSequence.map((u) => u.id);
        dto.originPathId = dao.learningPathId ?? undefined;
        dto.goal = dao.pathTeachingGoals.map((t) => t.id);

        return dto;
    }
}
