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
 * @interface TaskTodoInfoTaskTodoRead
 */
export interface TaskTodoInfoTaskTodoRead {
    /**
     * 
     * @type {Date}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    status: string;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    lockingStepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    maxStepsProcessed?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    lockAfterStep?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    workingTimeIntervals?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoRead
     */
    dueTime?: number | null;
}
