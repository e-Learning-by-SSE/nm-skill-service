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
 * @interface JobJsonldJobItemRead
 */
export interface JobJsonldJobItemRead {
    /**
     * 
     * @type {string | Map}
     * @memberof JobJsonldJobItemRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof JobJsonldJobItemRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof JobJsonldJobItemRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof JobJsonldJobItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof JobJsonldJobItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof JobJsonldJobItemRead
     */
    title?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobJsonldJobItemRead
     */
    users?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof JobJsonldJobItemRead
     */
    organization?: string;
}
