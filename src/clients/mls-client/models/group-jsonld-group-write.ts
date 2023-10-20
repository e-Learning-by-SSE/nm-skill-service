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
 * @interface GroupJsonldGroupWrite
 */
export interface GroupJsonldGroupWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof GroupJsonldGroupWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof GroupJsonldGroupWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupJsonldGroupWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupJsonldGroupWrite
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof GroupJsonldGroupWrite
     */
    organization: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupJsonldGroupWrite
     */
    users?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof GroupJsonldGroupWrite
     */
    mls1Id?: number | null;
}
