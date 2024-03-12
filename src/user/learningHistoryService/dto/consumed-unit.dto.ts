import { ConsumedUnitData, STATUS } from "@prisma/client";
import { ConsumedUnitUpdateDto } from "./consumed-unit-change.dto";
import { IsDefined } from "class-validator";

export class ConsumedUnitDto extends ConsumedUnitUpdateDto {
    @IsDefined()
    historyId: string;

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
        dao: ConsumedUnitData & {
            path: {
                position: number;
                pathId: string;
            }[];
        },
    ) {
        const dto: ConsumedUnitDto = {
            historyId: dao.historyId,
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
