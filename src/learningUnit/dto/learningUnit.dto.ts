import { IsDate } from "class-validator";
import { SearchLearningUnitCreationDto } from "./learningUnit-creation.dto";
import { LearningUnit, Skill } from "@prisma/client";

export class SearchLearningUnitDto extends SearchLearningUnitCreationDto {
    @IsDate()
    createdAt: string;

    @IsDate()
    updatedAt: string;

    static createFromDao(
        unit: LearningUnit & {
            teachingGoals?: Skill[];
            requirements?: Skill[];
        },
    ): SearchLearningUnitDto {
        return {
            id: unit.id,
            title: unit.title,
            language: unit.language,
            description: unit.description,
            requiredSkills: unit.requirements?.map((skill) => skill.id) ?? [],
            teachingGoals: unit.teachingGoals?.map((skill) => skill.id) ?? [],
            processingTime: unit.processingTime,
            rating: unit.rating,
            contentCreator: unit.contentCreator,
            contentProvider: unit.contentProvider,
            targetAudience: unit.targetAudience,
            semanticDensity: unit.semanticDensity,
            semanticGravity: unit.semanticGravity,
            contentTags: unit.contentTags,
            contextTags: unit.contextTags,
            linkToHelpMaterial:
                unit.linkToHelpMaterial === null ? undefined : unit.linkToHelpMaterial,
            lifecycle: unit.lifecycle,
            orga_id: unit.orga_id,
            createdAt: unit.createdAt.toISOString(),
            updatedAt: unit.updatedAt.toISOString(),
        };
    }
}
