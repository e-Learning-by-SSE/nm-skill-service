import { IsOptional, IsString } from "class-validator";

export class LearningUnitFilterDto {
    @IsOptional()
    @IsString({ each: true })
    requiredSkills?: string[];

    @IsOptional()
    @IsString({ each: true })
    teachingGoals?: string[];

    @IsOptional()
    @IsString({ each: true })
    owners?: string[];
}
