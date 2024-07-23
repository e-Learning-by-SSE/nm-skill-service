
import { LearningUnitInstance, STATUS } from "@prisma/client";
import { IsDefined, IsInt, IsOptional, IsString, Max, Min } from "class-validator";



export class LearningUnitInstanceDto {
    /**
     * Processing time in seconds.
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    actualProcessingTime?: number;

    /**
     * Test performance in percent.
     */
    @IsOptional()
    @Min(0)
    @Max(1)
    testPerformance?: number;

    /**
     * The ID of the LearningUnit that was consumed.
     */
    @IsString()
    unitId: string;

    /**
     * The status of the learning unit instance.
     */
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

}
