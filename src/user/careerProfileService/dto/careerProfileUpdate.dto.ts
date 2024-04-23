import { IsArray, IsOptional } from "class-validator";

/**
 * Models the part of the career profile that can be directly updated (non-object fields)
 */
export class CareerProfileUpdateDto {
    @IsArray()
    @IsOptional()
    professionalInterests?: string[];
    @IsArray()
    @IsOptional()
    selfReportedSkills?: string[];
}
