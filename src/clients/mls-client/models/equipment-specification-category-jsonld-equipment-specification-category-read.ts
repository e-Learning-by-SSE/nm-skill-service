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
import { EquipmentSpecificationsJsonldEquipmentSpecificationCategoryRead } from './equipment-specifications-jsonld-equipment-specification-category-read';
/**
 * 
 * @export
 * @interface EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
 */
export interface EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead {
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    type?: string;
    /**
     * 
     * @type {number}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    equipment?: string;
    /**
     * 
     * @type {Array<EquipmentSpecificationsJsonldEquipmentSpecificationCategoryRead>}
     * @memberof EquipmentSpecificationCategoryJsonldEquipmentSpecificationCategoryRead
     */
    specifications?: Array<EquipmentSpecificationsJsonldEquipmentSpecificationCategoryRead>;
}
