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
 * @interface GroupTaskTodoJsonldGroupTaskTodoWrite
 */
export interface GroupTaskTodoJsonldGroupTaskTodoWrite {
    /**
     * 
     * @type {string | Map}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    task: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    formAnswers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    groupTaskTodoLinks?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    status?: string;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    startTime?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    endTime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoWrite
     */
    equipments?: Array<string>;
}
