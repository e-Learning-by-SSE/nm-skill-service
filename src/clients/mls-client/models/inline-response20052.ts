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
import { ProjectTodoJsonldProjectTodoRead } from './project-todo-jsonld-project-todo-read';
/**
 * 
 * @export
 * @interface InlineResponse20052
 */
export interface InlineResponse20052 {
    /**
     * 
     * @type {Array<ProjectTodoJsonldProjectTodoRead>}
     * @memberof InlineResponse20052
     */
    hydramember: Array<ProjectTodoJsonldProjectTodoRead>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse20052
     */
    hydratotalItems?: number;
    /**
     * 
     * @type {InlineResponse200Hydraview}
     * @memberof InlineResponse20052
     */
    hydraview?: InlineResponse200Hydraview;
    /**
     * 
     * @type {InlineResponse200Hydrasearch}
     * @memberof InlineResponse20052
     */
    hydrasearch?: InlineResponse200Hydrasearch;
}
