import { IsDefined, IsNotEmpty } from "class-validator";

export class SubPathDto {
    @IsDefined()
    skill: string;

    @IsNotEmpty()
    learningUnits: readonly string[];

    constructor(skill: string, luIDs: readonly string[]) {
        this.skill = skill;
        this.learningUnits = luIDs;
    }
}
