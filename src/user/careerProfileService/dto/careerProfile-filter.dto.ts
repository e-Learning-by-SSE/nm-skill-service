import { IsOptional, IsString } from "class-validator";

export class CareerProfileFilterDto {
    @IsOptional()
    @IsString()
    userId?: string;
}
