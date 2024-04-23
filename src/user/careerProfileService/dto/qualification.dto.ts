import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Qualification } from "@prisma/client";

/**
 * Models a complete qualification (currently we use this DTO for creation/update/deletion)
 */
export class QualificationDto {
    @IsNotEmpty()
    @IsOptional()
    id: string;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsDate()
    date: Date;
    @IsOptional()
    @IsString()
    berufenetID?: string;

    /**
     * Creates a new QualificationDto from a DB result
     * @param qualification The DB result which shall be converted to a DTO
     * @returns The corresponding DTO
     */
    static createFromDao(qualification: Qualification): QualificationDto {
        return {
            id: qualification.id,
            title: qualification.title,
            date: qualification.date,
            berufenetID: qualification.berufenetId || undefined,
        };
    }
}
