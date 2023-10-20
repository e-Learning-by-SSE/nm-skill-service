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
 * @interface ExternalContentOrganization
 */
export interface ExternalContentOrganization {
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganization
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganization
     */
    organization?: string;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganization
     */
    externalContent?: string;
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganization
     */
    originalLicenseCount?: number;
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganization
     */
    currentLicenseCount?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    projects?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    tasks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    forms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    externalContentUsers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    directoriesForAll?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    directoriesForApprentice?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    directoriesForInstructor?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganization
     */
    licenseModel?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    elearnings?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    noMlsContents?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof ExternalContentOrganization
     */
    allowCopy?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganization
     */
    links?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof ExternalContentOrganization
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ExternalContentOrganization
     */
    updatedAt?: Date;
}
