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

    @IsOptional()
    teachingGoals?: string[];

    @IsDefined()
    requiredSkills?: string[];

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
