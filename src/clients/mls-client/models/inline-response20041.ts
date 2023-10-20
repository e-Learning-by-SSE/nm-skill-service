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
import { LicenseJsonldLicenseRead } from './license-jsonld-license-read';
/**
 * 
 * @export
 * @interface InlineResponse20041
 */
export interface InlineResponse20041 {
    /**
     * 
     * @type {Array<LicenseJsonldLicenseRead>}
     * @memberof InlineResponse20041
     */
    hydramember: Array<LicenseJsonldLicenseRead>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20041
     */
    hydratotalItems?: number;
    /**
     * 
     * @type {InlineResponse200Hydraview}
     * @memberof InlineResponse20041
     */
    hydraview?: InlineResponse200Hydraview;
    /**
     * 
     * @type {InlineResponse200Hydrasearch}
     * @memberof InlineResponse20041
     */
    hydrasearch?: InlineResponse200Hydrasearch;
}
