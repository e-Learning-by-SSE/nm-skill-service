import { STATUS } from "@prisma/client";
import { PathSummaryDto } from "./pathSummary.dto";
import { IsDefined } from "class-validator";

/**
 * Models a list of personalized learning paths.
 * Attributes of a path are reduced to their id, the learningPathId (if existent), and their status.
 * Entries are ordered descending by their update date.
 */
export class PersonalizedLearningPathsListDto {
    /**
     * The list to be returned (containing entries with a personalizedPathId, learningPathId, and status).
     */
    @IsDefined()
    paths: PathSummaryDto[];

    /**
     * Creates a new list of personalized learning paths based on the DB object.
     * @param pathDao The list of personalized learning paths from the db
     * @returns A new list of personalized learning paths as DTO (entries include only the personalizedPathId, learningPathId, and status)
     */
    static createFromDao(pathDao: { id: string; learningPathId: string | null; status: STATUS }[]) {
        const dto: PersonalizedLearningPathsListDto = {
            paths: pathDao.map((entry) => PathSummaryDto.createFromDao(entry)),
        };

        return dto;
    }
}
