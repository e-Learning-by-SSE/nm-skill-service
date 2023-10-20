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
 * @interface ChatMessageJsonld
 */
export interface ChatMessageJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof ChatMessageJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof ChatMessageJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ChatMessageJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ChatMessageJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    content?: string;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    sender?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof ChatMessageJsonld
     */
    chat?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ChatMessageJsonld
     */
    readBy?: Array<string>;
}
