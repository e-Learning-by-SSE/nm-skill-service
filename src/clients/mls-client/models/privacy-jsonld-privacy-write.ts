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
 * @interface PrivacyJsonldPrivacyWrite
 */
export interface PrivacyJsonldPrivacyWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    excerpt?: string;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    text?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    active?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    version?: string;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    organization?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PrivacyJsonldPrivacyWrite
     */
    privacyPDF?: string | null;
}
