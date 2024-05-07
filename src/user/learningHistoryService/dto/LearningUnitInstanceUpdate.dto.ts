import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * DTO for updating the learning progress for a LearningUnit (ConsumedUnit).
 */
export class LearningUnitInstanceUpdateDto {
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
}
