import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsUrl } from "class-validator";
import { MlsActionEntity } from "./mls-actionEntity.dto";
import { MlsActionType } from "./mls-actionType.dto";

export class MLSEvent {
    @IsEnum(MlsActionEntity)  
    @IsNotEmpty()
    entityType: MlsActionEntity;

    @IsEnum(MlsActionType)
    @IsNotEmpty()
    method: MlsActionType;

    @IsNotEmpty()
    id: string;

    constructor(entityType: MlsActionEntity, method: MlsActionType, id: string) {
       
        this.method = method;
        this.entityType = entityType;

        this.id = id;
    }
}
