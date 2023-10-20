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
 * @interface GroupTaskTodoJsonldGroupTaskTodoItemRead
 */
export interface GroupTaskTodoJsonldGroupTaskTodoItemRead {
    /**
     * 
     * @type {string | Map}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    type?: string;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    task: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    formSolutions?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    formAnswers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    formCorrections?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    formComments?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    assigner?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    rater?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    groupTaskTodoLinks?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    status?: string;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    scoredPoints?: number;
    /**
     * 
     * @type {number}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    maxPoints?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    lastEditor?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    startTime?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    endTime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GroupTaskTodoJsonldGroupTaskTodoItemRead
     */
    equipments?: Array<string>;
}
