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
 * @interface FilemanagerCreateFileBody
 */
export interface FilemanagerCreateFileBody {
    /**
     * 
     * @type {number}
     * @memberof FilemanagerCreateFileBody
     */
    parent?: number;
    /**
     * 
     * @type {Blob}
     * @memberof FilemanagerCreateFileBody
     */
    files?: Blob;
    /**
     * 
     * @type {number}
     * @memberof FilemanagerCreateFileBody
     */
    feedback?: number;
}
