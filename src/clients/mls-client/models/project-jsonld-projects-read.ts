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
 * @interface ProjectJsonldProjectsRead
 */
export interface ProjectJsonldProjectsRead {
    /**
     * 
     * @type {string | Map}
     * @memberof ProjectJsonldProjectsRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof ProjectJsonldProjectsRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ProjectJsonldProjectsRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof ProjectJsonldProjectsRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    organization?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    creator?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    type?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectJsonldProjectsRead
     */
    archived?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProjectJsonldProjectsRead
     */
    externalContentOrganizationCopySource?: string | null;
}
