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
 * @interface Link
 */
export interface Link {
    /**
     * 
     * @type {number}
     * @memberof Link
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof Link
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof Link
     */
    url?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof Link
     */
    externalContent?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Link
     */
    externalContentOrganizations?: Array<string>;
}
