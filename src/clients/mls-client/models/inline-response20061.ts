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
import { TaskPreviewImageJsonld } from './task-preview-image-jsonld';
/**
 * 
 * @export
 * @interface InlineResponse20061
 */
export interface InlineResponse20061 {
    /**
     * 
     * @type {Array<TaskPreviewImageJsonld>}
     * @memberof InlineResponse20061
     */
    hydramember: Array<TaskPreviewImageJsonld>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20061
     */
    hydratotalItems?: number;
    /**
     * 
     * @type {InlineResponse200Hydraview}
     * @memberof InlineResponse20061
     */
    hydraview?: InlineResponse200Hydraview;
    /**
     * 
     * @type {InlineResponse200Hydrasearch}
     * @memberof InlineResponse20061
     */
    hydrasearch?: InlineResponse200Hydrasearch;
}
