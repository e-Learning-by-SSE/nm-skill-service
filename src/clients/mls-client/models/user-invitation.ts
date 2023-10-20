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
 * @interface UserInvitation
 */
export interface UserInvitation {
    /**
     * 
     * @type {Date}
     * @memberof UserInvitation
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof UserInvitation
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof UserInvitation
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof UserInvitation
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInvitation
     */
    invitor?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserInvitation
     */
    email?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInvitation
     */
    role?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInvitation
     */
    organization?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserInvitation
     */
    groups?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof UserInvitation
     */
    approved?: boolean;
}
