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
 * @interface CollectionJsonld
 */
export interface CollectionJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof CollectionJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof CollectionJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof CollectionJsonld
     */
    type?: string;
    /**
     * Checks whether the collection is empty (contains no elements).
     * @type {boolean}
     * @memberof CollectionJsonld
     */
    empty?: boolean;
    /**
     * Gets all keys/indices of the collection.
     * @type {Array<number>}
     * @memberof CollectionJsonld
     */
    keys?: Array<number>;
    /**
     * Gets all values of the collection.
     * @type {Array<string>}
     * @memberof CollectionJsonld
     */
    values?: Array<string>;
    /**
     * 
     * @type {any}
     * @memberof CollectionJsonld
     */
    iterator?: any;
}
