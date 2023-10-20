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
 * @interface PrivacyPDFJsonld
 */
export interface PrivacyPDFJsonld {
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    type?: string;
    /**
     * 
     * @type {string | Map}
     * @memberof PrivacyPDFJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    privacy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    url?: string;
    /**
     * 
     * @type {Date}
     * @memberof PrivacyPDFJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof PrivacyPDFJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof PrivacyPDFJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    customFilename?: string;
    /**
     * 
     * @type {string}
     * @memberof PrivacyPDFJsonld
     */
    fileResource?: string;
}
