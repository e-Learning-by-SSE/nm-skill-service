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
 * @interface License
 */
export interface License {
    /**
     * 
     * @type {number}
     * @memberof License
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof License
     */
    type: string;
    /**
     * 
     * @type {number}
     * @memberof License
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof License
     */
    organization: string | null;
    /**
     * 
     * @type {number}
     * @memberof License
     */
    available?: number | null;
    /**
     * 
     * @type {number}
     * @memberof License
     */
    setted?: number | null;
    /**
     * 
     * @type {string}
     * @memberof License
     */
    note?: string | null;
}
