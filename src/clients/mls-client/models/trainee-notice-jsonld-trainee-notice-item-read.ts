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
import { TraineeNoticeFileJsonldTraineeNoticeItemRead } from './trainee-notice-file-jsonld-trainee-notice-item-read';
/**
 * 
 * @export
 * @interface TraineeNoticeJsonldTraineeNoticeItemRead
 */
export interface TraineeNoticeJsonldTraineeNoticeItemRead {
    /**
     * 
     * @type {string | Map}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    content?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    user?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    taskStep?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    taskTodo?: string | null;
    /**
     * 
     * @type {Array<TraineeNoticeFileJsonldTraineeNoticeItemRead>}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemRead
     */
    files?: Array<TraineeNoticeFileJsonldTraineeNoticeItemRead>;
}
