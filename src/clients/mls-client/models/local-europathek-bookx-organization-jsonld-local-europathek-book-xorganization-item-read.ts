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
 * @interface LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
 */
export interface LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead {
    /**
     * 
     * @type {string | Map}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    book?: string;
    /**
     * 
     * @type {string}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    organization?: string;
    /**
     * 
     * @type {number}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    licenses?: number | null;
    /**
     * 
     * @type {string}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    bookTitle?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof LocalEuropathekBookxOrganizationJsonldLocalEuropathekBookXOrganizationItemRead
     */
    users?: Array<string>;
}
