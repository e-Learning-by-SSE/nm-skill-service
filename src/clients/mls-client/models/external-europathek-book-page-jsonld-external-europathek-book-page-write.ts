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
 * @interface ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
 */
export interface ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    book?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    title?: string;
    /**
     * 
     * @type {number}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    pageIndex?: number;
    /**
     * 
     * @type {number}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    parentIndex?: number | null;
    /**
     * 
     * @type {number}
     * @memberof ExternalEuropathekBookPageJsonldExternalEuropathekBookPageWrite
     */
    level?: number;
}
