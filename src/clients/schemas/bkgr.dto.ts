import { IsNumber } from "class-validator";
import { BkgrTypDto } from ".";

export class BkgrDto {
    @IsNumber()
    id: number;

    typ: BkgrTypDto;
}
