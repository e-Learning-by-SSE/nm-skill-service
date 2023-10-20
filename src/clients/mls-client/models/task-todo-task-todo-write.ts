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
import { TaskTodoInfoTaskTodoWrite } from './task-todo-info-task-todo-write';
/**
 * 
 * @export
 * @interface TaskTodoTaskTodoWrite
 */
export interface TaskTodoTaskTodoWrite {
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    task: string;
    /**
     * 
     * @type {TaskTodoInfoTaskTodoWrite}
     * @memberof TaskTodoTaskTodoWrite
     */
    taskTodoInfo?: TaskTodoInfoTaskTodoWrite | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    shuffleQuestions?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    formAnswers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    scormAnswers?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    assigner?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    user: string | null;
    /**
     * 
     * @type {Date}
     * @memberof TaskTodoTaskTodoWrite
     */
    startTime?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof TaskTodoTaskTodoWrite
     */
    endTime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    note?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    instructorsToNotify?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    usedHelpingTopics?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof TaskTodoTaskTodoWrite
     */
    equipments?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TaskTodoTaskTodoWrite
     */
    mls1Id?: number | null;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    notice?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    organization?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskTodoTaskTodoWrite
     */
    equipmentMaintenance?: string | null;
}
