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
import { TaskJsonldTraineeNoticeRead } from './task-jsonld-trainee-notice-read';
/**
 * 
 * @export
 * @interface TaskStepJsonldTraineeNoticeRead
 */
export interface TaskStepJsonldTraineeNoticeRead {
    /**
     * 
     * @type {string | Map}
     * @memberof TaskStepJsonldTraineeNoticeRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTraineeNoticeRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTraineeNoticeRead
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepJsonldTraineeNoticeRead
     */
    title: string;
    /**
     * 
     * @type {TaskJsonldTraineeNoticeRead}
     * @memberof TaskStepJsonldTraineeNoticeRead
     */
    task?: TaskJsonldTraineeNoticeRead | null;
}
