import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PathFinderService } from "./pathFinder.service";
import { PathRequestDto } from "./dto";

@ApiTags("PathFinder")
@Controller("PathFinder")
export class PathFinderController {
    constructor(private pfService: PathFinderService) {}

    @Get("getConnectedGraphForSkill/:skillId")
    getConnectedGraphForSkill(@Param("skillId") skillId: string) {
        return this.pfService.getConnectedGraphForSkill(skillId, true);
    }

    @Get("getConnectedSkillGraphForSkill/:skillId")
    getConnectedSkillGraphForSkill(@Param("skillId") skillId: string) {
        return this.pfService.getConnectedGraphForSkill(skillId, false);
    }

    // @Get('getConnectedGraphForSkillwithResolvedElements/:skillId')
    // getConnectedGraphForSkillwithResolvedElements(@Param('skillId') skillId: string) {
    //   return this.pfService.getConnectedGraphForSkillwithResolvedElements(skillId);
    // }

    @Get("checkGraph/:skillId")
    checkGraph(@Param("skillId") skillId: string) {
        return this.pfService.isGraphForIdACycle(skillId);
    }

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

    // TODO: wird alles unterrichtet
    @Get("allSkillsDone/:repoId")
    allSkillsDone(@Param("repoId") repoId: string) {
        return this.pfService.allSkillsDone(repoId);
    }
}
