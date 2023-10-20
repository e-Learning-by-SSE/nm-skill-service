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
 * @interface TraineeNoticeJsonldTraineeNoticeWrite
 */
export interface TraineeNoticeJsonldTraineeNoticeWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    content?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    user?: string;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    taskStep?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    taskTodo?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    files?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TraineeNoticeJsonldTraineeNoticeWrite
     */
    mls1Id?: number | null;
}
