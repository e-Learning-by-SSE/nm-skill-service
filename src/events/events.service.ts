import { ForbiddenException, Injectable } from "@nestjs/common";

import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { MLSClient } from "../clients/clientService/mlsClient.service";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserCreationDto } from "../user/dto";
import { UserMgmtService } from "../user/user.service";

/**
 * Service that manages MLS Events
 * @author Wenzel
 */
@Injectable()
export class EventMgmtService {
    constructor(
        private learningUnitService: LearningUnitMgmtService,
        private userService: UserMgmtService,
    ) {}

    async getEvent(mlsEvent: MLSEvent) {
        switch (mlsEvent.entityType) {
            case MlsActionEntity.Task: {
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
                } else if (mlsEvent.method === MlsActionType.PUT) {
                    let client = new MLSClient();

                    let learningUnitDto = await client.getLearningUnitForId(mlsEvent.id);
                    let learningUnit = await this.learningUnitService.patchLearningUnit(mlsEvent.id, learningUnitDto);

                    return learningUnit;
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return this.learningUnitService.deleteLearningUnit(mlsEvent.id);
                } else {
                    return "error";
                }
            }

            case MlsActionEntity.User: {
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
                        null,
                        null,
                        null,
                        null,
                    );
                    return this.userService.createUser(userDto);

                } else if (mlsEvent.method === MlsActionType.PUT) {
                    let client = new MLSClient();

                    // ToDo? Create a user DTO based on the data from MLS (currently only state attribute)

                    // Get the new user state from MLS
                    let userState = await client.getUserStateForId(mlsEvent.id);
                    // Change the state and return the updated user
                    let user = await this.userService.patchUserState(mlsEvent.id, userState);

                    return user;
                //This is the same as PUT state to "inactive"    
                } else if (mlsEvent.method === MlsActionType.DELETE) {
                    return this.userService.patchUserState(mlsEvent.id, false);
                } else {
                    return new Error("Method for this action type not implemented.");
                }
            }
            case MlsActionEntity.TaskStep: {
                break;
            }

            default:
                return new ForbiddenException("MlsActionEntity unknown");
        }
    }
}
