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
import { EquipmentSpecificationsEquipmentSpecificationCategoryItemRead } from './equipment-specifications-equipment-specification-category-item-read';
/**
 * 
 * @export
 * @interface EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
 */
export interface EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead {
    /**
     * 
     * @type {Date}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    equipment?: string;
    /**
     * 
     * @type {Array<EquipmentSpecificationsEquipmentSpecificationCategoryItemRead>}
     * @memberof EquipmentSpecificationCategoryEquipmentSpecificationCategoryItemRead
     */
    specifications?: Array<EquipmentSpecificationsEquipmentSpecificationCategoryItemRead>;
}
