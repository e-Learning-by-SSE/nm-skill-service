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
 * @interface OrganizationOrganizationItemWrite
 */
export interface OrganizationOrganizationItemWrite {
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    streetno: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    zip: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    city: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    country: string;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    taskSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    taskStepCategories?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    formSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    groups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    users?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    privacies?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    termsOfUse?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    logo?: string | null;
    /**
     * 
     * @type {number}
     * @memberof OrganizationOrganizationItemWrite
     */
    mls1Id?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    formerUsers?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof OrganizationOrganizationItemWrite
     */
    blokId?: number | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    eCademyToken?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    scorms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    jobs?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    equipment?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    backgroundFile?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    christianiIds?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    scormGroups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    equipmentLocations?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    appTags?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    organizationHeadFile?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    organizationFooterFile?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    organizationHeaderFile?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    sharedTaskSets?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof OrganizationOrganizationItemWrite
     */
    userInvitations?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    organizationInGroup?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OrganizationOrganizationItemWrite
     */
    autofachmannSubscriptionNo?: string | null;
}
