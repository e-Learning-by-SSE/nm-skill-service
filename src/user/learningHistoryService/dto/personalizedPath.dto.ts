import { STATUS } from "@prisma/client";
import { LearningUnitInstanceStatusDto } from "./learningUnitInstanceStatus.dto";

/**
 * Models a reduced version of a personalized learning path.
 * Used for GET request.
 */
export class PersonalizedPathDto {
    /**
     * The id of the personalized path.
     */
    personalizedPathId: string;
    /**
     * The id of the learning path used as a template for the personalized path. Can be null when the path is created by the learner via goals.
     */
    learningPathId: string | null;
    /**
     * The goals (taught skill ids) of the personalized path (created by a learner). Can be empty when the path is based on an existing learning path.
     */
    goals: string[];
    /**
     * The status of the personalized path. Can be OPEN (newly enrolled), IN_PROGRESS (currently doing at least one contained learning unit), or FINISHED (all learning units are successfully finished)
     */
    status: STATUS;
    /**
     * The sequence of the contained learning unit instances (their id and status)
     */
    learningUnitInstances: LearningUnitInstanceStatusDto[];

    /**
     * Creates a new personalized path DTO based on the DB object.
     * @param pathDao The personalized path from the db
     * @returns A new personalized path as DTO
     */
    static createFromDao(pathDao: {
        id: string;
        learningPathId: string | null;
        pathTeachingGoals: { id: string }[];
        status: STATUS;
        unitSequence: { unitInstance: { id: string; status: STATUS } }[];
    }): PersonalizedPathDto {
        return {
            personalizedPathId: pathDao.id,
            learningPathId: pathDao.learningPathId,
            goals: pathDao.pathTeachingGoals.map((goal) => goal.id),
            status: pathDao.status,
            learningUnitInstances: pathDao.unitSequence.map((unit) =>
                LearningUnitInstanceStatusDto.createFromDao({
                    uniInstanceId: unit.unitInstance.id,
                    status: unit.unitInstance.status,
                }),
            ),
            
        };
    }
}
