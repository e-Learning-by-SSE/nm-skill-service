import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { LearningProfile } from "@prisma/client";
/**
 * Models a complete learning profile
 */
export class LearningProfileDto {
    @IsNotEmpty()
    @IsString()
    id: string; //Unique id, same as the user id to which it belongs

    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: "semanticDensity must be at least 0" })
    @Max(1, { message: "semanticDensity must be at most 1" })
    semanticDensity: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: "semanticGravity must be at least 0" })
    @Max(1, { message: "semanticGravity must be at most 1" })
    semanticGravity: number;

    mediaType: string[]; // Ordered ascending by preference, MIME types
    language: string[]; //Ordered ascending by preference, ISO 639-1 codes

    @IsNotEmpty()
    @IsInt()
    @Min(0, { message: "processingTimePerUnit must be at least 0" })
    processingTimePerUnit: number; // In minutes

    preferredDidacticMethod: string[]; //Ordered ascending by preference, method names

    /**
     * Creates a new complete learningProfileDto from the DB
     * @returns The learningProfileDTO
     */
    static createFromDao(learningProfile: LearningProfile): LearningProfileDto {
        return {
            id: learningProfile.userId,
            semanticDensity: learningProfile.semanticDensity,
            semanticGravity: learningProfile.semanticGravity,
            mediaType: learningProfile.mediaType,
            language: learningProfile.language,
            processingTimePerUnit: learningProfile.processingTimePerUnit,
            preferredDidacticMethod: learningProfile.preferredDidacticMethod,
        };
    }
}
