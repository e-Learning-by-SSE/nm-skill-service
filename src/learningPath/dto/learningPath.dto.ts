import { IsDefined, IsNotEmpty } from "class-validator";

import { LearningPath, PathGoal } from "@prisma/client";

import { PathGoalDto } from ".";

export class LearningPathDto {
    @IsNotEmpty()
    id: string;

    @IsDefined()
    title: string;

    @IsNotEmpty()
    owner: string;

    description?: string;

    @IsDefined()
    goals: PathGoalDto[];

    constructor(
        id: string,
        owner: string,
        title: string,
        description: string | null,
        goals: PathGoalDto[],
    ) {
        this.id = id;
        this.owner = owner;
        this.title = title;
        this.description = description ?? undefined;
        this.goals = goals;
    }

    static createFromDao(lp: LearningPath & { goals: PathGoal[] | null }): LearningPathDto {
        const goals: PathGoalDto[] = lp.goals?.map((goal) => PathGoalDto.createFromDao(goal)) ?? [];

        return new LearningPathDto(lp.id, lp.owner, lp.title ?? "", lp.description, goals);
    }
}
