import { IsDefined, IsOptional } from "class-validator";

/**
 * Request to compute a learning Path for a specified goal (set of skills to be obtained)
 * and optionally a specified user (learning behavior and progress to consider).
 */
export class PathRequestDto {
    /**
     * The list of skills to be learned.
     */
    @IsDefined()
    goal!: string[];

    /**
     * If specified, path will be computed and optimized for the specified user.
     * This includes:
     * - taking into account the user's current skills
     * - taking into account the user's learning behavior
     */
    @IsOptional()
    userId?: string;

    /**
     * If unspecified, algorithm will use a fast, greedy approach to find a path.
     * If true, the algorithm will try to find an optimal path, at cost of performance.
     */
    @IsOptional()
    optimalSolution?: boolean = false;
}
