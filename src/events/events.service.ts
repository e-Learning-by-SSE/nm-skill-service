import { ForbiddenException, Injectable } from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { MLSClient } from "../clients/mlsClient.service";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";
import { USERSTATUS } from "@prisma/client";

/**
 * Triggers actions when certain events related to tasks (like creating a TaskTodo) occur in the MLS system
 * Currently, needs a subscription in the MLS system (via the GUI).
 * Receives the complete object as message body.
 * @author Wenzel, Gerling
 */
@Injectable()
export class EventMgmtService {
    constructor(
        private learningUnitService: LearningUnitMgmtService,
        private userService: UserMgmtService,
    ) {}

    /**
     * Whenever the MLS event system publishes an event, this service is triggered.
     * For User events: Create an empty user, update existing user status (active, inactive), delete existing user (set status to inactive).
     * For Task events: Create an empty learning unit, update existing learning unit, delete existing learning unit.
     * For TaskTodo events: When task is finished, update learning unit status to finished, save scored points, update linked user.
     * For TaskTodoInfo events: Update the progress (StepProcessed, MaxStepsProcessed) within the learning unit.
     * @param mlsEvent Generic event, contains an entityType (User, Task, TaskTodo, TaskTodoInfo), method (PUT, POST, DELETE), id (in the MLS system), and the object itself as payload
     * @returns Depends on the use case? 
     */
    async getEvent(mlsEvent: MLSEvent) {

        switch (mlsEvent.entityType) {

            //MLS tasks are called learning units in this system
            case MlsActionEntity.Task: {

                //Create an empty learning unit with the provided id from MLS (when a task is created in MLS)
                //TODO: Why does this have to be empty?
                if (mlsEvent.method === MlsActionType.POST) {
                    let locDto: SearchLearningUnitCreationDto = new SearchLearningUnitCreationDto(
                        mlsEvent.id,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                    );
                    return this.learningUnitService.createLearningUnit(locDto);

                //Update an existing learning unit when the corresponding task in MLS is changed
                //Relevant values are: title, description, lifecycle, and creator    
                //TODO: There is a note about a required values check. If Lifecycle!=DRAFT, teachingGoal must be set?
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    let client = new MLSClient();

                    //Gets id, title, description, lifecycle, and creator from the MLS system
                    //Caution: A PUT may contain just a partial update
                    //TODO: Change, so that we can read the data directly from the event
                    //let learningUnitDto = await client.getLearningUnitForId(mlsEvent.id);
                    //let learningUnit = await this.learningUnitService.patchLearningUnit(mlsEvent.id, learningUnitDto);

                    console.log(mlsEvent.payload); 
                    let learningUnitPayload = mlsEvent.payload;
                    
                    //Only use the required key/value pair
                    //TODO: Handle when key is not existent (the result is "undefined")
                    console.log(learningUnitPayload["entityType" as keyof JSON]);

                    return learningUnitPayload;

                //Delete an existing learning unit if the corresponding task in MLS is deleted
                //TODO: Check that we only delete when lifecycle is draft?    
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return this.learningUnitService.deleteLearningUnit(mlsEvent.id);

                } else {
                    return new ForbiddenException("TaskEvent: Method for this action type not implemented.");
                }
            }

            //MLS users are only available as user profiles in this system
            case MlsActionEntity.User: {

                //Create a new empty user profile when a user is created in the MLS system
                //TODO: Why does this have to be empty? We could also read out the other values like state and name?
                if (mlsEvent.method === MlsActionType.POST) {
                    let userDto: UserCreationDto = new UserCreationDto(
                        mlsEvent.id,
                        null,
                        null,
                        null,
                        null,   
                        null,
                        null,
                        null,
                    );
                    return this.userService.createUser(userDto);

                //Change the user profile state when it is changed in MLS    
                } else if (mlsEvent.method === MlsActionType.PUT) {

                    //Try to read the state attribute of the user
                    let userState = mlsEvent.payload["state" as keyof JSON];

                    //Check if we got a valid result (MLS uses a boolean) and change the user state accordingly
                    if(userState != undefined){
                        if(userState == "true"){
                            let user = await this.userService.patchUserState(mlsEvent.id, USERSTATUS.ACTIVE);
                            return user;
                        } else if (userState == "false") {
                            let user = await this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);
                            return user;
                        }
                        else {
                            return new ForbiddenException("UserEvent: Unknown state attribute value "+userState+" from MLS user entity. Update aborted.");
                        }
                    }
                    else {
                        return new ForbiddenException("UserEvent: Could not read the state attribute from MLS user entity. Update aborted.");
                    }

                //This is the same as PUT state to "inactive"    
                //TODO: Specification does not mention a delete action
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return this.userService.patchUserState(mlsEvent.id, USERSTATUS.INACTIVE);
                    
                } else {
                    return new ForbiddenException("UserEvent: Method for this action type not implemented.");
                }
            }

            // A MLS teacher adds a MLS user ID to a Task (specifically to its taskTodos array), meaning the user has to complete this task
            // A taskTodo object contains the individual learning progress per user
            //TODO: There is no equivalent in this system? Relation to learning history?
            case MlsActionEntity.TaskToDo: {

                // When a TaskTodo is updated in the MLS system, update our user profile accordingly
                // Currently only when TaskTodo is finished? To update our learning history?
                if (mlsEvent.method === MlsActionType.PUT) {
                    //We do not need that, get info directly from payload
                    //let client = new MLSClient();

                    //We don't have a taskToDo DTO, this should be done in the learning history
                    //let taskTodoDto = await client.getTaskToDoForId(mlsEvent.id);
                    //TODO: Do we really have to calculate ourself when a task is finished successfully?
                    //let taskToDo = await this.taskToDoService.patchTaskToDo(mlsEvent.id, taskTodoDto);

                    return null;
                   // Reaction: From TaskToDo get:
                    /* task, (IRI)
                    user, (IRI)
                    TaskToDoInfo.status, (==FINISHED)
                    scoredPoints,
                    maxPoints
                    --> Update user profile: if (FINISHED && scorePoints/maxPoints >= 0.5) {skill is considered to be acquired} */

                } else {
                    return new ForbiddenException("TaskToDoEvent: Method for this action type not implemented.");
                }   
            }

            //TODO: What about taskTodoInfo? It is existing in the Excel table, but not in Miro
            case MlsActionEntity.TaskToDoInfo: {
                break;
            }

            default:
                return new ForbiddenException("MlsActionEntity unknown");
        }
    }
}
