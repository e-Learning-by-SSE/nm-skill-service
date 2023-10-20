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
 * @interface TraineeNoticeJsonldTraineeNoticeItemWrite
 */
export interface TraineeNoticeJsonldTraineeNoticeItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    content?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    user?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    taskStep?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    taskTodo?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TraineeNoticeJsonldTraineeNoticeItemWrite
     */
    files?: Array<string>;
}
