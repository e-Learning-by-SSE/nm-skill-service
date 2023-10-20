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
import { TaskTodoInfoJsonldTaskTodoItemWrite } from './task-todo-info-jsonld-task-todo-item-write';
/**
 * 
 * @export
 * @interface TaskTodoJsonldTaskTodoItemWrite
 */
export interface TaskTodoJsonldTaskTodoItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    task: string;
    /**
     * 
     * @type {TaskTodoInfoJsonldTaskTodoItemWrite}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    taskTodoInfo?: TaskTodoInfoJsonldTaskTodoItemWrite | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    formAnswers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    scormAnswers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    files?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    reactivated?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    archived?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    showToLearners?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    showInStatistic?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    usedHelpingTopics?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    equipments?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    notice?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoJsonldTaskTodoItemWrite
     */
    equipmentMaintenance?: string | null;
}
