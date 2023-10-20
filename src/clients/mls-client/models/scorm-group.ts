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
 * @interface ScormGroup
 */
export interface ScormGroup {
    /**
     * 
     * @type {Date}
     * @memberof ScormGroup
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ScormGroup
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ScormGroup
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ScormGroup
     */
    title: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ScormGroup
     */
    scorms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ScormGroup
     */
    organizations?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ScormGroup
     */
    owner?: string | null;
}
