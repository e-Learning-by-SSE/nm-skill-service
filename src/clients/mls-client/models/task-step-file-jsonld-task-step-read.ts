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
import { FileResourceJsonldTaskStepRead } from './file-resource-jsonld-task-step-read';
/**
 * 
 * @export
 * @interface TaskStepFileJsonldTaskStepRead
 */
export interface TaskStepFileJsonldTaskStepRead {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskStepFileJsonldTaskStepRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonldTaskStepRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonldTaskStepRead
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonldTaskStepRead
     */
    url?: string;
    /**
     * 
     * @type {FileResourceJsonldTaskStepRead}
     * @memberof TaskStepFileJsonldTaskStepRead
     */
    fileResource?: FileResourceJsonldTaskStepRead;
}
