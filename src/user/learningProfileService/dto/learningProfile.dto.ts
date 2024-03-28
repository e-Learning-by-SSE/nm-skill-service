import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { LearningProfile } from "@prisma/client";
/**
 * Models a complete learning profile
 */
export class LearningProfileDto {
    @IsNotEmpty()
    @IsString()
    id: string; //Unique id
    @IsNotEmpty()
    @IsNumber()
    semanticDensity: number;
    @IsNotEmpty()
    @IsNumber()
    semanticGravity: number;
    @IsNotEmpty()
    @IsString()
    mediaType: string;
    @IsNotEmpty()
    @IsString()
    language: string;
    @IsNotEmpty()
    @IsString()
    processingTimePerUnit: string;
    @IsNotEmpty()
    @IsString()
    userId: string; //The user to which this learning profile belongs
    @IsOptional()
    @IsString()
    preferredDidacticMethod?: string;
    


    /**
     * Creates a new complete learningProfileDto from the DB
     * @returns 
     */
    static createFromDao(learningProfile: LearningProfile): LearningProfileDto {
        return {
            id: learningProfile.id,
            semanticDensity: learningProfile.semanticDensity,
            semanticGravity: learningProfile.semanticGravity,
            mediaType: learningProfile.mediaType,
            language: learningProfile.language,
            processingTimePerUnit: learningProfile.processingTimePerUnit,
            userId: learningProfile.userId,
            preferredDidacticMethod: learningProfile.preferredDidacticMethod ?? undefined
        };

    }

    
}
