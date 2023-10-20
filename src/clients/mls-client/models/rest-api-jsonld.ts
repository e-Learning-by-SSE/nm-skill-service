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
 * @interface RestApiJsonld
 */
export interface RestApiJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof RestApiJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof RestApiJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof RestApiJsonld
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof RestApiJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof RestApiJsonld
     */
    consultant?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof RestApiJsonld
     */
    data?: Array<string> | null;
    /**
     * 
     * @type {Date}
     * @memberof RestApiJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof RestApiJsonld
     */
    updatedAt?: Date;
}
