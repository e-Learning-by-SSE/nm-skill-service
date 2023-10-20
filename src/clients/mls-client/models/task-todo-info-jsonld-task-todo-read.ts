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
 * @interface TaskTodoInfoJsonldTaskTodoRead
 */
export interface TaskTodoInfoJsonldTaskTodoRead {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    status: string;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    lockingStepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    maxStepsProcessed?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    lockAfterStep?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    workingTimeIntervals?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoJsonldTaskTodoRead
     */
    dueTime?: number | null;
}
