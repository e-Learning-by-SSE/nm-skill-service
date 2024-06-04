import { STATUS } from "@prisma/client";

/**
 * Status of a LearningUnitInstance in an personalized path.
 * Brings together the ID of a LearningUnit used for the instance and the learning status of user.
 * Used to prevent anonymous objects within returned arrays.
 */
export class LearningUnitInstanceStatusDto {
    //The id of the learning unit used for the instance (as this is sent to the API, where instances are not relevant)
    unitId: string;
    //The current status of the learning unit instance
    status: STATUS;

    static createFromDao(dao: { unitId: string; status: STATUS }): LearningUnitInstanceStatusDto {
        return {
            unitId: dao.unitId,
            status: dao.status,
        };
    }
}
