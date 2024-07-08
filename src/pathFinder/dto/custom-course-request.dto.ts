import { IsString, IsNotEmpty, IsOptional } from "class-validator";

/**
 * Request to create a custom learning path for the user by specifying the goal.
 * @author El-Sharkawy
 */
export class CustomCourseRequestDto {
    /**
     * Specifies the user for which the learning path should be computed.
     */
    @IsString()
    @IsNotEmpty()
    userId: string;

    /**
     * Specifies the skills to be obtained by the self-created learning path.
     */
    @IsNotEmpty()
    goals: string[];

    /**
     * If unspecified, algorithm will use a fast, greedy approach to find a path.
     * If true, the algorithm will try to find an optimal path, at cost of performance.
     */
    @IsOptional()
    optimalSolution?: boolean;
}
