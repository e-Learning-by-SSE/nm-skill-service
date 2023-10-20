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
 * @interface TaskStepFileJsonld
 */
export interface TaskStepFileJsonld {
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    type?: string;
    /**
     * 
     * @type {string | Map}
     * @memberof TaskStepFileJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    taskStep?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    url?: string;
    /**
     * 
     * @type {Date}
     * @memberof TaskStepFileJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof TaskStepFileJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof TaskStepFileJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    customFilename?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskStepFileJsonld
     */
    fileResource?: string;
}
