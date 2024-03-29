import { IsDefined, IsNotEmpty } from "class-validator";
import { Qualification } from "@prisma/client";
import { QualificationCreationDto } from "./qualification-creation.dto";

export class QualificationDto extends QualificationCreationDto {
    @IsNotEmpty()
    id: string;

    @IsDefined()
    userCareerProfileId: string;

    constructor(id: string, name: string, year: number) {
        super();
        this.id = id;
        this.name = name;
        this.year = year;
    }

    /**
     * Creates a new QualificationDto from a DB result
     * @param qualification The DB result which shall be converted to a DTO
     * @returns The corresponding DTO
     */
    static createFromDao(qualification: Qualification): QualificationDto {
        return new QualificationDto(qualification.id, qualification.name, qualification.year);
    }
}
