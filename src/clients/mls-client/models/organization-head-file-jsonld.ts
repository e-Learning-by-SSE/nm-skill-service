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
 * @interface OrganizationHeadFileJsonld
 */
export interface OrganizationHeadFileJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof OrganizationHeadFileJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    url?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    organization?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof OrganizationHeadFileJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof OrganizationHeadFileJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof OrganizationHeadFileJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    customFilename?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationHeadFileJsonld
     */
    fileResource?: string;
}
