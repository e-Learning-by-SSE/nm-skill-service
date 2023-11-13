import { IsDefined, IsNotEmpty } from "class-validator";

import { LearningPath, LearningUnit, Skill, LIFECYCLE } from "@prisma/client";

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

    targetAudience?: string;

    constructor(
        id: string,
        owner: string,
        title: string,
        description: string | null,
        targetAudience: string | null,
        lifecycle: LIFECYCLE,
        requirements: string[],
        pathGoals: string[],
        recommendedUnitSequence: string[],
    ) {
        this.id = id;
        this.owner = owner;
        this.title = title;
        this.description = description ?? undefined;
        this.targetAudience = targetAudience ?? undefined;
        this.lifecycle = lifecycle;
        this.requirements = requirements;
        this.pathGoals = pathGoals;
        this.recommendedUnitSequence = recommendedUnitSequence;
    }

    static createFromDao(
        lp: LearningPath & {
            requirements: Skill[];
            pathTeachingGoals: Skill[];
            recommendedUnitSequence: LearningUnit[];
        },
    ): LearningPathDto {
        const requirements = lp.requirements.map((requirement) => requirement.id);
        const goals = lp.pathTeachingGoals.map((goal) => goal.id);
        const recommendedUnitSequence = lp.recommendedUnitSequence.map((unit) => unit.id);
        return new LearningPathDto(
            lp.id,
            lp.owner,
            lp.title ?? "",
            lp.description,
            lp.targetAudience,
            lp.lifecycle,
            requirements,
            goals,
            recommendedUnitSequence,
        );
    }
}
