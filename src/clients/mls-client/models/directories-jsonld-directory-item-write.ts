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
import { DirectoriesJsonldDirectoryItemWrite } from './directories-jsonld-directory-item-write';
/**
 * 
 * @export
 * @interface DirectoriesJsonldDirectoryItemWrite
 */
export interface DirectoriesJsonldDirectoryItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    owner?: string | null;
    /**
     * 
     * @type {DirectoriesJsonldDirectoryItemWrite}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    parent?: DirectoriesJsonldDirectoryItemWrite | null;
    /**
     * 
     * @type {Array<DirectoriesJsonldDirectoryItemWrite>}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    directories?: Array<DirectoriesJsonldDirectoryItemWrite>;
    /**
     * 
     * @type {Array<string>}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    documents?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    isCommon?: boolean;
    /**
     * 
     * @type {string}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    organization?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    isRestricted?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    position?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    sharedForGroups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    sharedForUsers?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    isGroup?: boolean;
    /**
     * 
     * @type {number}
     * @memberof DirectoriesJsonldDirectoryItemWrite
     */
    mls1Id?: number | null;
}
