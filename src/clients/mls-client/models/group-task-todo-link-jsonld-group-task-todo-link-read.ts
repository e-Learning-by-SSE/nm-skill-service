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
 * @interface GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
 */
export interface GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead {
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    user?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    stepsProcessed?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    groupTaskTodo?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoLinkJsonldGroupTaskTodoLinkRead
     */
    lockAfterStep?: Array<string>;
}
