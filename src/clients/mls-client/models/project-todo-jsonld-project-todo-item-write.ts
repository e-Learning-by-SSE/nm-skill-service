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
 * @interface ProjectTodoJsonldProjectTodoItemWrite
 */
export interface ProjectTodoJsonldProjectTodoItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    project: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectTodoJsonldProjectTodoItemWrite
     */
    taskTodos?: Array<string>;
}
