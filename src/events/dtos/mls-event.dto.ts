import { IsDefined, IsNotEmpty, IsOptional, IsUrl } from "class-validator";
import { MlsActionEntity } from "./mls-actionEntity.dto";
import { MlsActionType } from "./mls-actionType.dto";

export class MLSEvent {
    @IsNotEmpty()
    entityType: MlsActionEntity;

    @IsNotEmpty()
    method: MlsActionType;

    @IsNotEmpty()
    id: string;

    constructor(entityType: string, method: string, id: string) {
        if (method === MlsActionType.CREATE) {
            this.method = MlsActionType.CREATE;
        } else if (method === MlsActionType.UPDATE) {
            this.method = MlsActionType.UPDATE;
        } else if (method === MlsActionType.PATCH) {
            this.method = MlsActionType.PATCH;
        } else {
            this.method = MlsActionType.PUT;
        }
        if (entityType === MlsActionEntity.Skill) {
            this.entityType = MlsActionEntity.Skill;
        } else if (entityType === MlsActionEntity.LearningUnit) {
            this.entityType = MlsActionEntity.LearningUnit;
        } else {
            this.entityType = MlsActionEntity.User;
        }
        this.method = MlsActionType.PUT;
        this.entityType = MlsActionEntity.User;

        this.id = id;
    }
}
