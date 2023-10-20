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
 * @interface OrganizationJsonldOrganizationItemWrite
 */
export interface OrganizationJsonldOrganizationItemWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    streetno: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    zip: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    city: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    country: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    taskSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    taskStepCategories?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    formSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    groups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    users?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    privacies?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    termsOfUse?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    logo?: string | null;
    /**
     * 
     * @type {number}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    mls1Id?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    formerUsers?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    blokId?: number | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    eCademyToken?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    scorms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    jobs?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    equipment?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    backgroundFile?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    christianiIds?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    scormGroups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    equipmentLocations?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    appTags?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    organizationHeadFile?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    organizationFooterFile?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    organizationHeaderFile?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    sharedTaskSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    userInvitations?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    organizationInGroup?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationJsonldOrganizationItemWrite
     */
    autofachmannSubscriptionNo?: string | null;
}
