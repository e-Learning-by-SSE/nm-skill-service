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
import { TaskSetTranslationJsonldTasksetTranslationRead } from './task-set-translation-jsonld-taskset-translation-read';
/**
 * 
 * @export
 * @interface InlineResponse20063
 */
export interface InlineResponse20063 {
    /**
     * 
     * @type {Array<TaskSetTranslationJsonldTasksetTranslationRead>}
     * @memberof InlineResponse20063
     */
    hydramember: Array<TaskSetTranslationJsonldTasksetTranslationRead>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20063
     */
    hydratotalItems?: number;
    /**
     * 
     * @type {InlineResponse200Hydraview}
     * @memberof InlineResponse20063
     */
    hydraview?: InlineResponse200Hydraview;
    /**
     * 
     * @type {InlineResponse200Hydrasearch}
     * @memberof InlineResponse20063
     */
    hydrasearch?: InlineResponse200Hydrasearch;
}
