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
 * @interface Equipment
 */
export interface Equipment {
    /**
     * 
     * @type {Date}
     * @memberof Equipment
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Equipment
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof Equipment
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    serial?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    creator?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    organization?: string;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    manufacturer?: string;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    category?: string;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    image?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Equipment
     */
    location?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    specificationCategory?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    files?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    fileLinks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    taskTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    groupTaskTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof Equipment
     */
    equipmentMaintenances?: Array<string>;
}
