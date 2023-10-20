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
 * @interface EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
 */
export interface EquipmentMaintenanceJsonldEquipmentMaintenanceWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    status?: string;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    staticInterval?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    dynamicInterval?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    lastRun?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    equipment?: string;
    /**
     * 
     * @type {string}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    task?: string;
    /**
     * 
     * @type {number}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    intervalLength?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof EquipmentMaintenanceJsonldEquipmentMaintenanceWrite
     */
    taskTodo?: Array<string>;
}
