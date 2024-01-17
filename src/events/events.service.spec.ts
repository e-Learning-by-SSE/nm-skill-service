import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { EventMgmtService } from "./events.service";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserMgmtService } from "../user/user.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";


describe("Event Service", () => {
    //Required Classes
    const config = new ConfigService();
    const db = new PrismaService(config);
    const userService = new UserMgmtService(db);
    const learningUnitFactory = new LearningUnitFactory(db);
    const learningUnitService = new LearningUnitMgmtService(learningUnitFactory); 
    const dbUtils = DbTestUtils.getInstance();

     // Test object
    const eventService = new EventMgmtService(learningUnitService, userService, config);

    // Wipe DB before each test
    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    // Wipe DB after all tests are finished
    afterAll(async () => {
        await dbUtils.wipeDb();
    });

    /**
     * Negative tests for the event handling API, testing all kinds of invalid inputs.
     */
    describe("negativeEventResponses", () => {
        it("should throw errors when getting invalid entities", async () => {
            // Arrange: Create events with invalid entities
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.Other,
                method: MlsActionType.PUT,
                id: "string",
                payload: JSON.parse("{}")
              };

            // Act and assert: Call the getEvent method with a non-existing entity
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (tasks)", async () => {
            // Arrange: Create events with invalid action types for tasks
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.Other,
                id: "string",
                payload: JSON.parse("{}")
              };

            // Act and assert: Call the getEvent method with a non-existing action type for tasks
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (users)", async () => {
            // Arrange: Create events with invalid action types for users
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.Other,
                id: "string",
                payload: JSON.parse("{}")
              };

            // Act and assert: Call the getEvent method with a non-existing action type for users
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (taskTodo)", async () => {
            // Arrange: Create events with invalid action types for taskTodo
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.TaskToDo,
                method: MlsActionType.POST,
                id: "string",
                payload: JSON.parse("{}")
              };

            // Act and assert: Call the getEvent method with a non-existing action type for taskTodo
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to update a non-existent task", async () => {
            // Arrange: Create events with invalid id
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.PUT,
                id: "non-existent",
                payload: JSON.parse("{}")
              };

            // Act and assert: Call the getEvent PUT method with a non-existing id for a task
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                NotFoundException,
            );
        });

        it("should throw errors when trying to delete a task that is not in DRAFT mode", async () => {
            // Arrange: Create events with invalid mode for deletion
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.DELETE,
                id: "not relevant",
                payload: JSON.parse("{\"lifecycle\":\"ACTIVE\"}")
              };

            // Act and assert: Call the getEvent DELETE method with a task that is not in DRAFT mode
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to update a user with unknown state value", async () => {
            // Arrange: Create events with invalid state values for a user update
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "not relevant",
                payload: JSON.parse("{\"state\":\"invalidValue\"}")
              };

            // Act and assert: Call the getEvent PUT method with invalid values for user state
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to update a user with missing state attribute", async () => {
            // Arrange: Create events with missing state attribute for a user update
            const invalidMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "not relevant",
                payload: JSON.parse("{\"noState\":\"notRelevant\"}")
              };

            // Act and assert: Call the getEvent PUT method with missing state attribute for user 
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        //ToDo: Tests vor TaskTodo when finished   
        //TaskTodoInfo is not implemented yet, unclear if needed
        //Creation with already existing ids is not tested here, this should happen in the respective tests for the user and learning unit

    });

    /**
     * Positive tests for the event handling API for MLS tasks (our learning units), testing all kinds of valid inputs.
     */
    describe("learningUnitCreationUpdateDeletion", () => {
        it("should create a valid learning unit", async () => {
            // Arrange: Define test data and create event input
            const validMLSEvent : MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.POST,
                id: "test1",
                payload: JSON.parse("{\"noState\":\"notRelevant\"}")
              };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(validMLSEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect(createdEntry).toBeDefined();

            //Updates and deletion
        });

    });
});
