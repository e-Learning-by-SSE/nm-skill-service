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
 * @interface GroupTaskTodoLink
 */
export interface GroupTaskTodoLink {
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoLink
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoLink
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoLink
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLink
     */
    user?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoLink
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLink
     */
    groupTaskTodo?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoLink
     */
    lockAfterStep?: Array<string>;
}
