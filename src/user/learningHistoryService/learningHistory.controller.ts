import { Body, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningHistoryService } from "./learningHistory.service";
import { STATUS } from "@prisma/client";

@ApiTags("LearningHistory")
@Controller("learning-history")
export class LearningHistoryController {
    constructor(private learningHistoryService: LearningHistoryService) {}

    /** 
     * Returns the learned skills of a user (sorted descending by creation date) 
     * @param userId The id of the user (and its learning history) whose learned skills are to be returned
    */
    @Get(":history_id/learned-skills")
    getLearnedSkills(@Param("history_id") historyId: string) {
        return this.learningHistoryService.getLearnedSkillsOfUser(historyId);
    }

    /**
     * Returns the personalized learning paths of a user.
     * @param userId The id of the user (and its learning history) whose personalized paths are to be returned
     * @param status The status (OPEN/IN_PROGRESS/FINISHED) of the paths to be returned (optional)
     */
    @Get(":history_id/personalized-paths")
    getPersonalizedPaths(@Param("history_id") historyId: string, @Body("status") status: STATUS){
        return this.learningHistoryService.getPersonalizedPathsOfUser(historyId, status);
    }

    /**
     * Returns a personalized learning path.
     * @param pathId The id of the personalized learning path to be returned.
     */
    @Get(":history_id/personalized-paths/:path_id")
    getPersonalizedPath(@Param("path_id") pathId: string){
        return this.learningHistoryService.getPersonalizedPath(pathId);
    }
    
}
