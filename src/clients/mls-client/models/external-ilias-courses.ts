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
 * @interface ExternalIliasCourses
 */
export interface ExternalIliasCourses {
    /**
     * 
     * @type {Date}
     * @memberof ExternalIliasCourses
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ExternalIliasCourses
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ExternalIliasCourses
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof ExternalIliasCourses
     */
    licenses?: number | null;
    /**
     * 
     * @type {number}
     * @memberof ExternalIliasCourses
     */
    available?: number | null;
    /**
     * 
     * @type {number}
     * @memberof ExternalIliasCourses
     */
    setted?: number | null;
    /**
     * 
     * @type {number}
     * @memberof ExternalIliasCourses
     */
    externalIliasCourseRefId?: number;
    /**
     * 
     * @type {string}
     * @memberof ExternalIliasCourses
     */
    organizationSettings?: string | null;
}
