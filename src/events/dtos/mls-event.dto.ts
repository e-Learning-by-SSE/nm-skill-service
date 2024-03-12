import { IsEnum, IsJSON, IsNotEmpty, IsOptional, IsString, isString} from "class-validator";
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
    @IsString()
    id: string;

    /**
     * The complete entity (including its id and all other attributes existing in the MLS system)
     */
    @IsNotEmpty()
    @IsJSON()
    payload: JSON;

    /**
     * A special payload to get the parent object of a taskTodoInfo object. Only existent for this kind of object.
     */
    @IsOptional()
    @IsJSON()
    taskTodoPayload?: JSON;

    /**
     * Constructor only used for testing purposes
     * @param entityType 
     * @param method 
     * @param id 
     * @param payload 
     * @param taskTodoPayload 
     */
    constructor(entityType: MlsActionEntity, method: MlsActionType, id: string, payload: JSON, taskTodoPayload?: JSON) {     
        this.method = method;
        this.entityType = entityType;
        this.id = id;
        this.payload = payload;
        this.taskTodoPayload = taskTodoPayload;
    }
}
