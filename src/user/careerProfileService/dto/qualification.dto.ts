import { IsNotEmpty, IsOptional } from "class-validator";
import { Qualification } from "@prisma/client";

export class QualificationDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    date: Date;
    @IsOptional()
    berufenetID?: string;
    @IsNotEmpty()
    careerProfileId: string;

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
            careerProfileId: qualification.careerProfileId,
        };
    }
}
