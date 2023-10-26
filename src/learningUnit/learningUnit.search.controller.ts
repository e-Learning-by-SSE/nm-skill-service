import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger"; // Import ApiQuery decorator

import { SearchLearningUnitCreationDto } from "./dto/search";

import { LearningUnitMgmtService } from "./learningUnit.service";
import { MLSEvent } from "../events/dtos/mls-event.dto";
import { LearningUnitFilterDto } from "./dto/search/learningUnit-filter.dto";
import { LIFECYCLE } from "@prisma/client";

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
        name: "processingTime",
        required: false,
        type: String,
        description: "Filter by processingTime",
    })
    @ApiQuery({ name: "rating", required: false, type: Number, description: "Filter by rating" })
    @ApiQuery({
        name: "contentCreator",
        required: false,
        type: Number,
        description: "Filter by contentCreator",
    })
    @ApiQuery({
        name: "contentProvider",
        required: false,
        type: Number,
        description: "Filter by contentProvider",
    })
    @ApiQuery({
        name: "targetAudience",
        required: false,
        type: Number,
        description: "Filter by targetAudience",
    })
    @ApiQuery({
        name: "semanticDensity",
        required: false,
        type: Number,
        description: "Filter by semanticDensity",
    })
    @ApiQuery({
        name: "semanticGravity",
        required: false,
        type: Number,
        description: "Filter by semanticGravity",
    })
    @ApiQuery({
        name: "contentTags",
        required: false,
        type: [String],
        description: "Filter by required contentTags",
    })
    @ApiQuery({
        name: "contextTags",
        required: false,
        type: [String],
        description: "Filter by required contextTags",
    })
    @ApiQuery({
        name: "lifecycle",
        enum: LIFECYCLE, // Use the enum for valid values
        required: false,
        type: "string",
        description: "Filter by lifecycle",
    })
    @ApiQuery({
        name: "orga_id",
        required: false,
        type: [String],
        description: "Filter by required orga_id",
    })
    @ApiQuery({
        name: "language",
        required: false,
        type: [String],
        description: "Filter by required language",
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

    @Post("events/")
    getEvents(@Body() dto: MLSEvent) {
        return this.learningUnitService.getEvent(dto);
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
