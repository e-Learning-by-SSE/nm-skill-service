
import { LearningUnitInstance, STATUS } from "@prisma/client";
import { IsDefined } from "class-validator";
import { LearningUnitInstanceUpdateDto } from "./LearningUnitInstanceUpdate.dto";



export class LearningUnitInstanceDto extends LearningUnitInstanceUpdateDto {

    @IsDefined()
    status: STATUS;

    /**
     * The date when the unit was selected for learning.
     */
    @IsDefined()
    date: string;

    /**
     * Optional list of personal learning paths at which the unit is included.
     */
    @IsDefined()
    learningPaths: string[];

    static createFromDao(
        dao: LearningUnitInstance & {
            path: {
                position: number;
                pathId: string;
            }[];
        },
    ) {
        const dto: LearningUnitInstanceDto = {
            unitId: dao.unitId,
            status: dao.status,
            learningPaths: dao.path.map((p) => p.pathId),
            date: dao.date.toISOString(),
            actualProcessingTime: dao.actualProcessingTime,
            testPerformance: dao.testPerformance.toNumber(),
        };

        return dto;
    }
}
