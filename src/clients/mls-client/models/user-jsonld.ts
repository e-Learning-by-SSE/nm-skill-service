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
 * User
 * @export
 * @interface UserJsonld
 */
export interface UserJsonld {
    /**
     * 
     * @type {string | Map}
     * @memberof UserJsonld
     */
    context?: string | Map;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    keycloakUuid?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof UserJsonld
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof UserJsonld
     */
    updatedAt?: Date;
    /**
     * 
     * @type {number}
     * @memberof UserJsonld
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    username?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    groups?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    roles?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    password?: string;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    firstname: string;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    lastname: string;
    /**
     * just to combine $firstname and $lastname, needs no column in database
     * @type {string}
     * @memberof UserJsonld
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    email: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof UserJsonld
     */
    state?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    organizations?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    createdForms?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    userOptions?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    tasksTodo?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    groupTaskTodoLinks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    userPrivacies?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    userTermsOfUse?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    createdTasks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    editedTasks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    assignedTaskTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    assignedGroupTaskTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    editedForms?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    invitedUsers?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    guestRoleRequests?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    directories?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    documents?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    ratedTaskTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    purchasedExternalContent?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    projects?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    assignedProjectTodos?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    projectsTodo?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    traineeNotices?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof UserJsonld
     */
    mls1Id?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    updatedTasks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    inactiveOrganizations?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    christianiId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserJsonld
     */
    christianiToken?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    equipment?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    sharedDirectories?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    sharedDocuments?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof UserJsonld
     */
    autofachmannId?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    localEuropathekBooks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    externalEuropathekBooks?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    createdChats?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    chats?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    sendedChatMessages?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserJsonld
     */
    shownGroups?: Array<string>;
    /**
     * A visual identifier that represents this user.
     * @type {string}
     * @memberof UserJsonld
     */
    userIdentifier?: string;
    /**
     * Returning a salt is only needed, if you are not using a modern hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     * @type {string}
     * @memberof UserJsonld
     */
    salt?: string | null;
}
