import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { LIFECYCLE } from "@prisma/client";

/**
 * Creates a new learningUnit
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class SearchLearningUnitUpdateDto {
    /**
     * Must be a referenced ID of a TASK in MLS.
     */
    @IsNotEmpty()
    id: string;

    @IsOptional()
    language?: string;

    /**
     * Tristate update logic:
     * - Undefined: No change
     * - Null: Removes all existing goals
     * - Array: Sets / Overwrites new goals
     */
    @IsOptional()
    teachingGoals?: string[] | null;

    /**
     * Tristate update logic:
     * - Undefined: No change
     * - Null: Removes all existing requirements
     * - Array: Sets / Overwrites new requirements
     */
    @IsDefined()
    requiredSkills?: string[] | null;

    @IsOptional()
    processingTime?: string;

    @IsOptional()
    rating?: string;

    @IsOptional()
    contentCreator?: string;

    @IsOptional()
    contentProvider?: string;

    @IsOptional()
    targetAudience?: string[];

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
}
