import { IsDefined } from "class-validator";

export class DeleteLearningProgressDto {
    @IsDefined() skillId: string; // The ID of the skill for which learning progress is being deleted
}
