import { IsOptional } from "class-validator";

/**
 * Updates an existing Skill.
 */
export class SkillUpdateDto {
    /**
     * Specifies nested child skills:
     * - If undefined: No change
     * - If null: Remove all nested skills
     * - If specified: Replace all nested skills with the specified ones
     */
    @IsOptional()
    nestedSkills?: string[] | null;

    /**
     * Specifies parent skills:
     * - If undefined: No change
     * - If null: Remove all parent skills -> Make this a top level skill
     * - If specified: Replace all parent skills with the specified ones
     */
    @IsOptional()
    parentSkills?: string[] | null;

    /**
     * Moves this and all nested skills to the specified repository.
     */
    @IsOptional()
    repositoryId?: string;

    /**
     * Renames the skill.
     */
    @IsOptional()
    name?: string;

    /*
     * Changes the level of the skill.
     */
    @IsOptional()
    level?: number;

    /*
     * Changes the description of the skill:
     * - If undefined: No change
     * - If null: Remove the description
     * - If specified: Replace the description with the specified one
     */
    @IsOptional()
    description?: string | null;
}
