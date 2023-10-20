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
 * @interface EquipmentMaintenanceEquipmentItemRead
 */
export interface EquipmentMaintenanceEquipmentItemRead {
    /**
     * 
     * @type {number}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    status?: string;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    staticInterval?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    dynamicInterval?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    lastRun?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    task?: string;
    /**
     * 
     * @type {number}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    intervalLength?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof EquipmentMaintenanceEquipmentItemRead
     */
    taskTodo?: Array<string>;
}
