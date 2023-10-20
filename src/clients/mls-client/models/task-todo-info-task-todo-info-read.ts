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
 * @interface TaskTodoInfoTaskTodoInfoRead
 */
export interface TaskTodoInfoTaskTodoInfoRead {
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    status: string;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    lockingStepsProcessed?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    taskTodo?: string | null;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    maxStepsProcessed?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    lockAfterStep?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    workingTimeIntervals?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoInfoTaskTodoInfoRead
     */
    dueTime?: number | null;
}
