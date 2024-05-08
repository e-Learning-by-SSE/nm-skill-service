import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LearningHistoryService } from "./learningHistory.service";

@ApiTags("LearningHistory")
@Controller("learning-history")
export class LearningHistoryController {
    constructor(private learningHistoryService: LearningHistoryService) {}

    /** Returns the learned skills of a user (sorted descending by creation date) 
     * @param userId The id of the user (and its learning history) whose learned skills are to be returned
    */
    @Get(":history_id/learned-skills")
    getLearnedSkills(@Param("history_id") historyId: string) {
        return this.learningHistoryService.getLearnedSkillsOfUser(historyId);
    }
    
}
