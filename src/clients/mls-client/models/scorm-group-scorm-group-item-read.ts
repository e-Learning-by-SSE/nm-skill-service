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
 * @interface ScormGroupScormGroupItemRead
 */
export interface ScormGroupScormGroupItemRead {
    /**
     * 
     * @type {Date}
     * @memberof ScormGroupScormGroupItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ScormGroupScormGroupItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ScormGroupScormGroupItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ScormGroupScormGroupItemRead
     */
    title: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ScormGroupScormGroupItemRead
     */
    scorms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ScormGroupScormGroupItemRead
     */
    organizations?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ScormGroupScormGroupItemRead
     */
    owner?: string | null;
}
