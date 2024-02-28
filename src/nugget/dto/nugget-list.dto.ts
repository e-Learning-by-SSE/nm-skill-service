import { IsDefined } from "class-validator";
import { NuggetDto } from "./nugget.dto";

export class NuggetListDto {
    @IsDefined()
    nuggets: NuggetDto[];
}
