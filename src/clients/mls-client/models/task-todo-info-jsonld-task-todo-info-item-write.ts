/* tslint:disable */
/* eslint-disable */
/**
 * MLS2 API
 * Central API
 *
 * OpenAPI spec version: 0.7.2
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface TaskTodoInfoJsonldTaskTodoInfoItemWrite
 */
export interface TaskTodoInfoJsonldTaskTodoInfoItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    status: string;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    lockingStepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    maxStepsProcessed?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    lockAfterStep?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoInfoItemWrite
     */
    dueTime?: number | null;
}
