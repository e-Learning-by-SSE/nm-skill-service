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
import { InlineResponse200Hydrasearch } from './inline-response200-hydrasearch';
import { InlineResponse200Hydraview } from './inline-response200-hydraview';
import { TermsOfUsePDFJsonld } from './terms-of-use-pdfjsonld';
/**
 * 
 * @export
 * @interface InlineResponse20073
 */
export interface InlineResponse20073 {
    /**
     * 
     * @type {Array<TermsOfUsePDFJsonld>}
     * @memberof InlineResponse20073
     */
    hydramember: Array<TermsOfUsePDFJsonld>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20073
     */
    hydratotalItems?: number;
    /**
     * 
     * @type {InlineResponse200Hydraview}
     * @memberof InlineResponse20073
     */
    hydraview?: InlineResponse200Hydraview;
    /**
     * 
     * @type {InlineResponse200Hydrasearch}
     * @memberof InlineResponse20073
     */
    hydrasearch?: InlineResponse200Hydrasearch;
}
