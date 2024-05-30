import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PathFinderService } from "./pathFinder.service";
import {
    CustomCoursePreviewResponseDto,
    CustomCourseRequestDto,
    EnrollmentPreviewResponseDto,
    EnrollmentRequestDto,
    PathRequestDto,
    PathStorageRequestDto,
    SkillsToAnalyze,
} from "./dto";
import { PersonalizedLearningPath } from "@prisma/client";

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
     *
     * Parameters:
     * - goal (mandatory): The list of skills to be learned.
     *
     * Returns:
     * - If the return path is empty, then there are no learning units for the skill.
     *
     * @param dto Specifies the search parameters (see above)
     * @returns The list os the missing skill with the sub paths for them
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
        return this.pfService.enrollment(
            userId,
            pathId,
            false,
            optimalSolution,
        ) as unknown as EnrollmentPreviewResponseDto;
    }

    @Post("adapted-path")
    enrollment(@Body() dto: EnrollmentRequestDto) {
        return this.pfService.enrollment(
            dto.userId,
            dto.learningPathId,
            true,
            dto.optimalSolution,
        ) as unknown as PersonalizedLearningPath;
    }

    @Post("calculated-path")
    enrollmentByGoal(@Body() dto: CustomCourseRequestDto) {
        return this.pfService.enrollmentByGoal(
            dto.userId,
            dto.goals,
            true,
            dto.optimalSolution,
        ) as unknown as CustomCoursePreviewResponseDto;
    }
    @Get("calculated-path")
    simulateEnrollmentByGoal(
        @Query("userId") userId: string,
        @Query("goals") goals: string[],
        @Query("optimalSolution") optimalSolution?: boolean,
    ) {
        return this.pfService.enrollmentByGoal(
            userId,
            goals,
            false,
            optimalSolution,
        ) as unknown as EnrollmentPreviewResponseDto;
    }

    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post(":userId")
    storePersonalizedPath(@Param("userId") userId: string, @Body() dto: PathStorageRequestDto) {
        return this.pfService.storePersonalizedPath(userId, dto);
    }
}
