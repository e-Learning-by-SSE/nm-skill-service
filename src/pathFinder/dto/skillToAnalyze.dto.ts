import { IsDefined, IsNotEmpty } from "class-validator";

/**
 * Request to analyze missing skills and subpaths for a specified goal (set of skills to be obtained)
 * and optionally a specified user (learning behavior and progress to consider).
 */
export class SkillsToAnalyze {
    /**
     * The list of skills to be learned.
     */
    @IsNotEmpty()
    @IsDefined()
    goal!: string[];
    
}
