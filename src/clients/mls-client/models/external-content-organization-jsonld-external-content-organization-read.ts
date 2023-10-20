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
import { ExternalContentJsonldExternalContentOrganizationRead } from './external-content-jsonld-external-content-organization-read';
import { ExternalContentUserJsonldExternalContentOrganizationRead } from './external-content-user-jsonld-external-content-organization-read';
/**
 * 
 * @export
 * @interface ExternalContentOrganizationJsonldExternalContentOrganizationRead
 */
export interface ExternalContentOrganizationJsonldExternalContentOrganizationRead {
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    organization?: string;
    /**
     * 
     * @type {ExternalContentJsonldExternalContentOrganizationRead}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    externalContent?: ExternalContentJsonldExternalContentOrganizationRead;
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    originalLicenseCount?: number;
    /**
     * 
     * @type {number}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    currentLicenseCount?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    projects?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    tasks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    forms?: Array<string>;
    /**
     * 
     * @type {Array<ExternalContentUserJsonldExternalContentOrganizationRead>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    externalContentUsers?: Array<ExternalContentUserJsonldExternalContentOrganizationRead>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    directoriesForAll?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    directoriesForApprentice?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    directoriesForInstructor?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    licenseModel?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    elearnings?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    noMlsContents?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    allowCopy?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof ExternalContentOrganizationJsonldExternalContentOrganizationRead
     */
    links?: Array<string>;
}
