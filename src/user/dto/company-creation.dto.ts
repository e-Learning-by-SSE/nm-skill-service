import { IsNotEmpty } from "class-validator";

/**
 * Creates a new Company
 */
export class CompanyCreationDto {
    @IsNotEmpty()
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
