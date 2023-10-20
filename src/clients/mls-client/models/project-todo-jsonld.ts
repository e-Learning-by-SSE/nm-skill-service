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
 * @interface ProjectTodoJsonld
 */
export interface ProjectTodoJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof ProjectTodoJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof ProjectTodoJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ProjectTodoJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ProjectTodoJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    project: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    assigner?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    user?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ProjectTodoJsonld
     */
    scoredPoints?: number;
    /**
     * 
     * @type {number}
     * @memberof ProjectTodoJsonld
     */
    maxPoints?: number;
    /**
     * 
     * @type {Date}
     * @memberof ProjectTodoJsonld
     */
    startTime?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof ProjectTodoJsonld
     */
    endTime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonld
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectTodoJsonld
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectTodoJsonld
     */
    taskTodos?: Array<string>;
}
