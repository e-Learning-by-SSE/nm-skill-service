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
import { TaskStepFileJsonldTaskStepItemRead } from './task-step-file-jsonld-task-step-item-read';
import { TaskStepJsonldTaskStepItemRead } from './task-step-jsonld-task-step-item-read';
/**
 * 
 * @export
 * @interface TaskStepJsonldTaskStepItemRead
 */
export interface TaskStepJsonldTaskStepItemRead {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    title: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    content?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    helpingTopics?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    taskStepCategory?: string | null;
    /**
     * 
     * @type {TaskStepJsonldTaskStepItemRead}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    parent?: TaskStepJsonldTaskStepItemRead | null;
    /**
     * 
     * @type {Array<TaskStepJsonldTaskStepItemRead>}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    taskSteps?: Array<TaskStepJsonldTaskStepItemRead>;
    /**
     * 
     * @type {number}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    position?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    task?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    stop?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    connectedForms?: Array<string>;
    /**
     * 
     * @type {Array<TaskStepFileJsonldTaskStepItemRead>}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    files?: Array<TaskStepFileJsonldTaskStepItemRead>;
    /**
     * 
     * @type {number}
     * @memberof TaskStepJsonldTaskStepItemRead
     */
    mls1Id?: number | null;
}
