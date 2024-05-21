import { STATUS } from "@prisma/client";
import { IsDefined, IsNotEmpty } from "class-validator";

/**
 * Part of the PersonalizedLearningPathsListDto to list available paths.
 */
export class PathSummaryDto {
    @IsNotEmpty()
    personalizedPathId: string;

    learningPathId: string | null;

    @IsDefined()
    status: STATUS;

    static createFromDao(dao: { id: string; learningPathId: string | null; status: STATUS }) {
        const dto: PathSummaryDto = {
            personalizedPathId: dao.id,
            learningPathId: dao.learningPathId,
            status: dao.status,
        };

        return dto;
    }
}
