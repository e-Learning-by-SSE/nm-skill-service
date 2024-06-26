import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PathFinderService } from "./pathFinder.service";
import {
    CustomCourseRequestDto,
    EnrollmentRequestDto,
    PathRequestDto,
    SkillsToAnalyze,
} from "./dto";

@ApiTags("PathFinder")
@Controller("PathFinder")
export class PathFinderController {
    constructor(private pfService: PathFinderService) {}

    /**
     * Computes the optimal learning path to learn the specified skill(s).
     *
     * Parameters:
     * - goal (mandatory): The list of skills to be learned.
     * - userId (optional): If specified, path will be computed and optimized for the specified user, e.g., considering learned skills and learning behavior.
     * - optimalSolution (optional): If unspecified, algorithm will use a fast, greedy approach to find a path. If true, the algorithm will try to find an optimal path, at cost of performance.
     * @param dto Specifies the search parameters (see above)
     * @returns The computed path
     *
     * @example
     * Default path for learning Java (skill 1009)
     * ```json
     * {
     *   "goal": ["1009"]
     * }
     * ```
     *
     * Path for learning DigiMedia (skills 2501 - 2512) for user 2001, ensure performant computation
     * ```json
     * {
     *   "goal": ["2501", "2502", "2503", "2504", "2505", "2506", "2507", "2508", "2509", "2510", "2511", "2512"],
     *   "userId": "2001",
     *   "optimalSolution": false
     * }
     * ```
     */
    @Post("computePath/")
    computePath(@Body() dto: PathRequestDto) {
        return this.pfService.computePath(dto);
    }

    /**
     * Analysis a skill (goal) to find the missing skills in the learning path.
     * Should only be called if **no** path can be found via `computePath`.
     *
     * Parameters:
     * - goal (mandatory): The list of skills to be learned.
     *
     * Returns:
     * - 409 - If there exist a path to the goal, use `computePath` instead.
     * - A skill with an empty list of skills: The skill is needed to learn the goal, but there is no path to learn this skill
     *
     * @param dto Specifies the search parameters (see above)
     * @returns The list os the missing skills with the sub paths for them
     *
     * @example
     * Default path for learning Java (skill 1009)
     * ```json
     * {
     *   "goal": ["1009"]
     * }
     * ```
     */
    @Post("skillAnalysis/")
    skillAnalysis(@Body() dto: SkillsToAnalyze) {
        return this.pfService.skillAnalysis(dto);
    }

    @Get("adapted-path")
    simulateEnrollment(
        @Query("userId") userId: string,
        @Query("learningPathId") pathId: string,
        @Query("optimalSolution") optimalSolution?: boolean,
    ) {
        return this.pfService.enrollmentSimulation(userId, pathId, optimalSolution);
    }

    @Post("adapted-path")
    enrollment(@Body() dto: EnrollmentRequestDto) {
        return this.pfService.enrollment(dto.userId, dto.learningPathId, dto.optimalSolution);
    }

    @Post("calculated-path")
    enrollmentByGoal(@Body() dto: CustomCourseRequestDto) {
        return this.pfService.enrollmentByGoal(dto.userId, dto.goals, dto.optimalSolution);
    }

    @Get("calculated-path")
    simulateEnrollmentByGoal(
        @Query("userId") userId: string,
        @Query("goals") goals: string[],
        @Query("optimalSolution") optimalSolution?: boolean,
    ) {
        return this.pfService.enrollmentByGoalPreview(userId, goals, optimalSolution);
    }
}
