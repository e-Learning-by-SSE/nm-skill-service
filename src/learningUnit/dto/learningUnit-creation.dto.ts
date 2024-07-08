import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { LIFECYCLE } from "@prisma/client";

/**
 * Creates a new learningUnit
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class SearchLearningUnitCreationDto {
    /**
     * Must be a referenced ID of a TASK in MLS.
     */
    @IsNotEmpty()
    id: string;

    @IsOptional()
    language?: string;

    @IsDefined()
    teachingGoals: string[];

    @IsDefined()
    requiredSkills: string[];

    @IsOptional()
    processingTime?: string;

    @IsOptional()
    rating?: string;

    @IsOptional()
    contentCreator?: string;

    @IsOptional()
    contentProvider?: string;

    @IsDefined()
    targetAudience: string[];

    @IsOptional()
    semanticDensity?: string;

    @IsOptional()
    semanticGravity?: string;

    @IsOptional()
    contentTags?: string[];

    @IsOptional()
    contextTags?: string[];

    @IsOptional()
    linkToHelpMaterial?: string;

    @IsOptional()
    lifecycle?: LIFECYCLE;

    @IsOptional()
    orga_id?: string;

    /**
     * Alternative, shorthand factory method to create testing objects.
     * Only mandatory properties that are used during test need to be defined.
     * @param params The properties to be set.
     * @returns An instance suitable for testing, where all unset values are treated as `null`.
     */
    static createForTesting(
        params: Partial<SearchLearningUnitCreationDto>,
    ): SearchLearningUnitCreationDto {
        return {
            id: params.id ?? "",
            language: params.language ?? "en",
            processingTime: params.processingTime ?? undefined,
            rating: params.rating ?? undefined,
            contentCreator: params.contentCreator ?? undefined,
            contentProvider: params.contentProvider ?? undefined,
            targetAudience: params.targetAudience ?? [],
            semanticDensity: params.semanticDensity ?? undefined,
            semanticGravity: params.semanticGravity ?? undefined,
            contentTags: params.contentTags ?? undefined,
            contextTags: params.contextTags ?? undefined,
            linkToHelpMaterial: params.linkToHelpMaterial ?? undefined,
            lifecycle: params.lifecycle ?? LIFECYCLE.DRAFT,
            orga_id: params.orga_id ?? undefined,
            requiredSkills: params.requiredSkills ?? [],
            teachingGoals: params.teachingGoals ?? [],
        };
    }
}
