import { IsString, IsNotEmpty, IsOptional } from "class-validator";

/**
 * Request to enroll a user into a (personalized) learning path.
 * @author El-Sharkawy
 */
export class EnrollmentRequestDto {
    /**
     * Specifies the user for which the learning path should be computed.
     */
    @IsString()
    @IsNotEmpty()
    userId: string;

    /**
     * Specifies the learning path for which the user should be enrolled.
     */
    @IsString()
    @IsNotEmpty()
    learningPathId: string;

    /**
     * If unspecified, algorithm will use a fast, greedy approach to find a path.
     * If true, the algorithm will try to find an optimal path, at cost of performance.
     */
    @IsOptional()
    optimalSolution?: boolean;
}
