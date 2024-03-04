import { OmitType } from "@nestjs/swagger";
import { SkillRepositoryDto } from "./skill-repository.dto";
import { IsOptional } from "class-validator";

export class SkillRepositoryUpdateDto extends OmitType(SkillRepositoryDto, [
    "owner",
    "id",
    "name",
]) {
    @IsOptional()
    owner?: string;

    @IsOptional()
    name?: string;
}
