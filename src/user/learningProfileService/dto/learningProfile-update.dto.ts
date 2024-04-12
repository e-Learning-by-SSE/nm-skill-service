import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * Models a learning profile with optional values for updating
 */
export class LearningProfileUpdateDto {
    @IsNotEmpty({ message: "Id cannot be empty" })
    @IsString({ message: "Id must be a valid string" })
    id: string; //Unique id, same as the user id to which it belongs

    @IsOptional()
    @IsNumber()
    @Min(0, { message: "semanticDensity must be at least 0" })
    @Max(1, { message: "semanticDensity must be at most 1" })
    semanticDensity?: number;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: "semanticGravity must be at least 0" })
    @Max(1, { message: "semanticGravity must be at most 1" })
    semanticGravity?: number;

    @IsOptional()
    @IsArray()
    mediaType?: string[]; // Ordered ascending by preference, MIME types

    @IsOptional()
    @IsArray()
    language?: string[]; //Ordered ascending by preference, ISO 639-1 codes

    @IsOptional()
    @IsInt({ message: "processingTimePerUnit must be a whole number (minutes)" })
    @Min(0, { message: "processingTimePerUnit must be at least 0" })
    processingTimePerUnit?: number; // In minutes

    @IsOptional()
    @IsArray()
    preferredDidacticMethod?: string[]; //Ordered ascending by preference, method names

}
