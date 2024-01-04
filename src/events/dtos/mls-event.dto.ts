import { IsEnum, IsNotEmpty} from "class-validator";
import { MlsActionEntity } from "./mls-actionEntity.dto";
import { MlsActionType } from "./mls-actionType.dto";

/**
 * Wraps an event sent by the MLS system.
 */
export class MLSEvent {

    /**
     * Which entity is concerned by the event? User/Task/TaskTodo/TaskTodoInfo
     */
    @IsEnum(MlsActionEntity)  
    @IsNotEmpty()
    entityType: MlsActionEntity;

    /**
     * What kind is the event of? PUT/POST/DELETE
     */
    @IsEnum(MlsActionType)
    @IsNotEmpty()
    method: MlsActionType;

    /**
     * The unique id used in the MLS system for the entity.
     */
    @IsNotEmpty()
    id: string;

    /**
     * The complete entity (including its id and all other attributes existing in the MLS system)
     */
    @IsNotEmpty()
    payload: string;

    constructor(entityType: MlsActionEntity, method: MlsActionType, id: string, payload: string) {     
        this.method = method;
        this.entityType = entityType;
        this.id = id;
        this.payload = payload;
    }
}
