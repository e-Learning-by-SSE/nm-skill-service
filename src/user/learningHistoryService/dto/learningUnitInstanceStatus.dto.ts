import { STATUS } from "@prisma/client";

/**
 * Status of a LearningUnitInstance in an personalized path.
 * Brings together the ID of a LearningUnitInstance and the learning status of user.
 * Used to prevent anonymous objects within returned arrays.
 */
export class LearningUnitInstanceStatusDto {
    uniInstanceId: string;

    status: STATUS;

    static createFromDao(dao: { uniInstanceId: string; status: STATUS }): LearningUnitInstanceStatusDto {
        return {
            uniInstanceId: dao.uniInstanceId,
            status: dao.status,
        };
    }
}
