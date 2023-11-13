import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

/**
 * Creates a new LearningUnit (Basic implementation for all extensions).
 *
 * @author Sascha El-Sharkawy <elscha@sse.uni-hildesheim.de>
 * @author Wenzel
 */
export class LearningUnitCreationDto {
    /**
     * Must be a referenced ID of a TASK in MLS.
     */
    @IsNotEmpty()
    id: string;

    @IsOptional()
    title?: string;

    @IsOptional()
    language?: string;

    @IsOptional()
    description?: string;

    @IsDefined()
    teachingGoals: string[] = [];

    @IsDefined()
    requiredSkills: string[] = [];

    constructor(
        id: string,
        title?: string | null,
        language?: string | null,
        description?: string | null,
    ) {
        this.id = id;
        this.title = title ?? undefined;
        this.language = language ?? undefined;
        this.description = description ?? undefined;
    }
}
