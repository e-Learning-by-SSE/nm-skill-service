import { IsDate } from "class-validator";
import { SearchLearningUnitCreationDto } from "./learningUnit-creation.dto";
import { LIFECYCLE, LearningUnit } from "@prisma/client";

export class SearchLearningUnitDto extends SearchLearningUnitCreationDto {
    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;

    constructor(
        id: string,
        title: string,

        language: string,
        description: string,
        processingTime: string | null,
        rating: string | null,
        contentCreator: string | null,
        contentProvider: string | null,
        targetAudience: string | null,
        semanticDensity: string | null,
        semanticGravity: string | null,
        contentTags: string[] | null,
        contextTags: string[] | null,
        linkToHelpMaterial: string | null,
        lifecycle: LIFECYCLE,
        orga_id: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(
            id,
            language,
            title,

            description,
            processingTime,
            rating,
            contentCreator,
            contentProvider,
            targetAudience,
            semanticDensity,
            semanticGravity,
            contentTags,
            contextTags,
            linkToHelpMaterial,
            lifecycle,
            orga_id,
        );
        this.createdAt = createdAt.toISOString();
        this.updatedAt = updatedAt.toISOString();
    }

    static createFromDao(unit: LearningUnit): SearchLearningUnitDto {
        return new SearchLearningUnitDto(
            unit.id,
            unit.title,
            unit.language,
            unit.description,
            unit.processingTime,
            unit.rating,
            unit.contentCreator,
            unit.contentProvider,
            unit.targetAudience,
            unit.semanticDensity,
            unit.semanticGravity,
            unit.contentTags,
            unit.contextTags,
            unit.linkToHelpMaterial,
            unit.lifecycle,
            unit.orga_id,
            unit.createdAt,
            unit.updatedAt,
        );
    }
}
