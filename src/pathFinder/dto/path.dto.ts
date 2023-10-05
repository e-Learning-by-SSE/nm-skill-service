import { IsDefined, IsNotEmpty } from "class-validator";

export class PathDto {
    @IsNotEmpty()
    learningUnits: readonly string[];

    @IsDefined()
    cost: number;

    constructor(luIDs: readonly string[], cost: number) {
        this.learningUnits = luIDs;
        this.cost = cost;
    }
}
