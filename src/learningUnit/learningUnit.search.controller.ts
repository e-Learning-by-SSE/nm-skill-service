import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger"; // Import ApiQuery decorator
import { SearchLearningUnitCreationDto, LearningUnitFilterDto } from "./dto";
import { LearningUnitMgmtService } from "./learningUnit.service";

@ApiTags("Learning-units")
@Controller("learning-units")
export class SearchLearningUnitController {
    constructor(private learningUnitService: LearningUnitMgmtService) {}

    /**
   * Lists all learningUnits.
   
   * @returns List of all learningUnits.
   */
    @Get("showAllLearningUnits")
    listLearningUnits() {
        return this.learningUnitService.loadAllLearningUnits();
    }

    /**
     * Creates a new learningUnit at the specified repository and returns the created learningUnit.
     * @param userId The owner of the repository
     * @param repositoryId The repository at which the learningUnit shall be added to.
     * @param dto The learningUnit description
     * @returns The created learningUnit.
     */
    @Post("/")
    addLearningUnitSearch(@Body() dto: SearchLearningUnitCreationDto) {
        return this.learningUnitService.createLearningUnit(dto);
    }
    @Get("/")
    @ApiQuery({
        name: "owners",
        required: false,
        type: [String],
        description: "Filter by owners",
    })
    @ApiQuery({
        name: "teachingGoals",
        required: false,
        type: [String],
        description: "Filter by required teachingGoals",
    })
    @ApiQuery({
        name: "requiredSkills",
        required: false,
        type: [String],
        description: "Filter by required skills",
    })
    getLearningUnitSearchWithFilter(@Query() filter: LearningUnitFilterDto) {
        return this.learningUnitService.getLearningUnitByFilter(filter);
    }

    /**
     * Returns the specified learningUnit.
     * @param learningUnitId The ID of the learningUnit, that shall be returned
     * @returns The specified learningUnit.
     */
    @Get(":learningUnitId")
    getLearningUnit(@Param("learningUnitId") learningUnitId: string) {
        return this.learningUnitService.getLearningUnit(learningUnitId);
    }
    @Delete(":learningUnitId")
    deleteLearningUnit(@Param("learningUnitId") learningUnitId: string) {
        return this.learningUnitService.deleteLearningUnit(learningUnitId);
    }
    @Patch(":learningUnitId")
    patchLearningUnit(
        @Param("learningUnitId") learningUnitId: string,
        @Body() dto: SearchLearningUnitCreationDto,
    ) {
        return this.learningUnitService.patchLearningUnit(learningUnitId, dto);
    }
    @Put(":learningUnitId/checks")
    checkLearningUnit(@Param("learningUnitId") learningUnitId: string) {
        return this.learningUnitService.checkLearningUnit(learningUnitId);
    }
}
