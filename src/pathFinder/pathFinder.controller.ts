import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { PathFinderService } from "./pathFinder.service";
import { PathRequestDto, PathStorageRequestDto, SkillToAnalysis } from "./dto";

@ApiTags("PathFinder")
@Controller("PathFinder")
export class PathFinderController {
    constructor(private pfService: PathFinderService) {}

    // @ApiOperation({ deprecated: true })
    // @Get("getConnectedGraphForSkill/:skillId")
    // getConnectedGraphForSkill(@Param("skillId") skillId: string) {
    //     return this.pfService.getConnectedGraphForSkill(skillId, true);
    // }

    // @ApiOperation({ deprecated: true })
    // @Get("getConnectedSkillGraphForSkill/:skillId")
    // getConnectedSkillGraphForSkill(@Param("skillId") skillId: string) {
    //     return this.pfService.getConnectedGraphForSkill(skillId, false);
    // }

    // @ApiOperation({ deprecated: true })
    // @Get("checkGraph/:skillId")
    // checkGraph(@Param("skillId") skillId: string) {
    //     return this.pfService.isGraphForIdACycle(skillId);
    // }

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
    skillAnalysis(@Body() dto: SkillToAnalysis) {
        return this.pfService.skillAnalysis(dto);
    }
    
    @ApiOperation({ summary: "Experimental (WIP)" })
    @Post(":userId")
    storePersonalizedPath(@Param("userId") userId: string, @Body() dto: PathStorageRequestDto) {
        return this.pfService.storePersonalizedPath(userId, dto);
    }
}
