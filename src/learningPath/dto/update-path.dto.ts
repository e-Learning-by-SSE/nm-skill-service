import { IsOptional } from "class-validator";
import { LIFECYCLE } from "@prisma/client";

export class UpdatePathRequestDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string | null;

    @IsOptional()
    targetAudience?: string | null;

    @IsOptional()
    owner?: string;

    @IsOptional()
    lifecycle?: LIFECYCLE;

    @IsOptional()
    requirements?: string[] | null;

    @IsOptional()
    pathGoals?: string[] | null;

    @IsOptional()
    recommendedUnitSequence?: string[] | null;
}
