import { IsInt, IsOptional, IsString, Min } from "class-validator";

/**
 * DTO for updating the learning progress for a LearningUnit (ConsumedUnit).
 */
export class ConsumedUnitUpdateDto {
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
    testPerformance?: number;

    /**
     * The ID of the LearningUnit that was consumed.
     */
    @IsString()
    unitId: string;
}
