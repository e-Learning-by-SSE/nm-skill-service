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
 * @interface DocumentsJsonldDocumentItemWrite
 */
export interface DocumentsJsonldDocumentItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    owner?: string;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    parent?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    isCommon?: boolean;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    organization?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    isRestricted?: boolean | null;
    /**
     * 
     * @type {boolean}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    isGroup?: boolean;
    /**
     * 
     * @type {string}
     * @memberof DocumentsJsonldDocumentItemWrite
     */
    customFilename?: string;
}
