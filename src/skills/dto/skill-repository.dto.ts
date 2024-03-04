import { IsNotEmpty, IsOptional } from "class-validator";
import { ACCESS_RIGHTS, SkillMap } from "@prisma/client";
import { SkillRepositorySelectionDto } from "./skill-repository-selection.dto";

/**
 * Represents a skill repository (for reading).
 */
export class SkillRepositoryDto extends SkillRepositorySelectionDto {
    @IsNotEmpty()
    owner: string;

    @IsNotEmpty()
    id: string;

    @IsOptional()
    taxonomy?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    access_rights?: ACCESS_RIGHTS;

    static createFromDao(repository: SkillMap): SkillRepositoryDto {
        const dto: SkillRepositoryDto = {
            id: repository.id,
            owner: repository.ownerId,
            name: repository.name,
            version: repository.version,
            taxonomy: repository.taxonomy,
            description: repository.description ?? undefined,
            access_rights: repository.access_rights,
        };

        return dto;
    }
}
