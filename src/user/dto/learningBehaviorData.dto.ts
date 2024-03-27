import { IsNotEmpty, IsString } from "class-validator";


export class LearningBehaviorDataDto {

    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    userId: string;
    @IsNotEmpty()
    learningBehaviorData: string;
    @IsNotEmpty()
    timestamp: Date;
    @IsNotEmpty()
    version: number;

    static createFromDao( learningBehaviorData: LearningBehaviorDataDto): LearningBehaviorDataDto {
        const dto: LearningBehaviorDataDto = {
            id: learningBehaviorData.id,
            userId: learningBehaviorData.userId,
            learningBehaviorData: learningBehaviorData.learningBehaviorData,
            timestamp: learningBehaviorData.timestamp,
            version: learningBehaviorData.version,
        };
        return dto;
    }
}