import { IsNumber, IsString } from "class-validator";
import { BkgrDto } from ".";

/**
 * Reverse engineered from the response of the BerufeNet API to provide a type-safe interface.
 */
export class JobResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    kurzBezeichnungNeutral: string;

    bkgr: BkgrDto;
}
