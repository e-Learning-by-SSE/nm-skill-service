import { IsDate, IsDefined, IsNotEmpty } from "class-validator";
import { LearningPath, Skill, LIFECYCLE } from "@prisma/client";

export class LearningPathDto {
    @IsNotEmpty()
    id: string;

    @IsDefined()
    title: string;

    @IsNotEmpty()
    owner: string;

    description?: string;

    @IsDefined()
    lifecycle: LIFECYCLE;

    @IsDefined()
    pathGoals: string[];

    @IsDefined()
    requirements: string[];

    @IsDefined()
    recommendedUnitSequence: string[];

    @IsDefined()
    targetAudience: string[];

    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;

    static createFromDao(
        lp: LearningPath & {
            requirements: Skill[];
            pathTeachingGoals: Skill[];
        },
    ) {
        const dto: LearningPathDto = {
            id: lp.id,
            owner: lp.owner,
            title: lp.title ?? "",
            description: lp.description ?? undefined,
            targetAudience: lp.targetAudience,
            lifecycle: lp.lifecycle,
            requirements: lp.requirements.map((requirement) => requirement.id),
            pathGoals: lp.pathTeachingGoals.map((goal) => goal.id),
            recommendedUnitSequence: (lp.recommendedUnitSequence as string[]) ?? [],
            createdAt: lp.createdAt.toISOString(),
            updatedAt: lp.updatedAt.toISOString(),
        };

        return dto;
    }
}
