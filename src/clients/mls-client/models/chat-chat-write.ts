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
 * @interface ChatChatWrite
 */
export interface ChatChatWrite {
    /**
     * 
     * @type {Array<string>}
     * @memberof ChatChatWrite
     */
    participants?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ChatChatWrite
     */
    group?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ChatChatWrite
     */
    name?: string;
}
