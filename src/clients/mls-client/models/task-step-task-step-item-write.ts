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
import { TaskStepTaskStepItemWrite } from './task-step-task-step-item-write';
/**
 * 
 * @export
 * @interface TaskStepTaskStepItemWrite
 */
export interface TaskStepTaskStepItemWrite {
    /**
     * 
     * @type {string}
     * @memberof TaskStepTaskStepItemWrite
     */
    title: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepTaskStepItemWrite
     */
    content?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepTaskStepItemWrite
     */
    helpingTopics?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TaskStepTaskStepItemWrite
     */
    taskStepCategory?: string | null;
    /**
     * 
     * @type {TaskStepTaskStepItemWrite}
     * @memberof TaskStepTaskStepItemWrite
     */
    parent?: TaskStepTaskStepItemWrite | null;
    /**
     * 
     * @type {number}
     * @memberof TaskStepTaskStepItemWrite
     */
    position?: number;
    /**
     * 
     * @type {boolean}
     * @memberof TaskStepTaskStepItemWrite
     */
    stop?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskStepTaskStepItemWrite
     */
    files?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskStepTaskStepItemWrite
     */
    mls1Id?: number | null;
}
