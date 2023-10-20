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
 * @interface TaskSetTasksetWrite
 */
export interface TaskSetTasksetWrite {
    /**
     * 
     * @type {string}
     * @memberof TaskSetTasksetWrite
     */
    locale?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskSetTasksetWrite
     */
    title: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskSetTasksetWrite
     */
    tasks?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TaskSetTasksetWrite
     */
    organization?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskSetTasksetWrite
     */
    translations?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof TaskSetTasksetWrite
     */
    isDefaultTaskSet?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskSetTasksetWrite
     */
    sharedOrganizations?: Array<string>;
}
