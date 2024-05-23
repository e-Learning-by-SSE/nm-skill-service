import { STATUS } from "@prisma/client";

/**
 * Status of a LearningUnitInstance in an personalized path.
 * Brings together the ID of a LearningUnit and the learning status of user.
 */
export class LearningProgressDto {
    unitId: string;

    status: STATUS;

    static createFromDao(dao: { unitId: string; status: STATUS }): LearningProgressDto {
        return {
            unitId: dao.unitId,
            status: dao.status,
        };
    }
}
