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
import { OrganizationJobRead } from './organization-job-read';
/**
 * 
 * @export
 * @interface JobJobRead
 */
export interface JobJobRead {
    /**
     * 
     * @type {number}
     * @memberof JobJobRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof JobJobRead
     */
    title?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof JobJobRead
     */
    users?: Array<string>;
    /**
     * 
     * @type {OrganizationJobRead}
     * @memberof JobJobRead
     */
    organization?: OrganizationJobRead;
}
