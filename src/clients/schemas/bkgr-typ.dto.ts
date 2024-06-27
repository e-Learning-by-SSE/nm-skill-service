import { IsNumber } from "class-validator";

export class BkgrTypDto {
    @IsNumber()
    id: number;
}
