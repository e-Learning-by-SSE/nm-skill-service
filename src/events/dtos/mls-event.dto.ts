import { IsEnum, IsJSON, IsNotEmpty, IsOptional, IsString, isString } from "class-validator";
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
    //@IsJSON() This is too restrictive
    payload: JSON;

    /**
     * A special payload to get the parent object of a taskTodoInfo object. Only existent for this kind of object.
     */
    @IsOptional()
    //@IsJSON() This is too restrictive
    taskTodoPayload?: JSON;
}
