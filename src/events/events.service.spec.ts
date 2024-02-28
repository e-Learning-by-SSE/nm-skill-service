import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { EventMgmtService } from "./events.service";
import { LearningUnitMgmtService } from "../learningUnit/learningUnit.service";
import { UserMgmtService } from "../user/user.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { MLSEvent, MlsActionEntity, MlsActionType } from "./dtos";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto/learningUnit-creation.dto";
import { LIFECYCLE, USERSTATUS } from "@prisma/client";
import { UserCreationDto } from "../user/dto/user-creation.dto";

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
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.Other,
                method: MlsActionType.PUT,
                id: "string",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing entity
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (tasks)", async () => {
            // Arrange: Create events with invalid action types for tasks
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.Other,
                id: "string",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing action type for tasks
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (users)", async () => {
            // Arrange: Create events with invalid action types for users
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.Other,
                id: "string",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing action type for users
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (taskTodo)", async () => {
            // Arrange: Create events with invalid action types for taskTodo
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDo,
                method: MlsActionType.POST,
                id: "string",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing action type for taskTodo
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to delete a task that is not in DRAFT mode", async () => {
            // Arrange: Create events with invalid mode for deletion
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.DELETE,
                id: "not relevant",
                payload: JSON.parse('{"lifecycle":"ACTIVE"}'),
            };

            // Act and assert: Call the getEvent DELETE method with a task that is not in DRAFT mode
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to update a user with unknown state value", async () => {
            // Arrange: Create events with invalid state values for a user update
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "not relevant",
                payload: JSON.parse('{"state":"invalidValue"}'),
            };

            // Act and assert: Call the getEvent PUT method with invalid values for user state
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to update a user with missing state attribute", async () => {
            // Arrange: Create events with missing state attribute for a user update
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "not relevant",
                payload: JSON.parse('{"noState":"notRelevant"}'),
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
        it("should create a valid learning unit, update it, and then delete it", async () => {
            // Arrange: Define test data and create event input
            const validMLSPostEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.POST,
                id: "test1",
                payload: JSON.parse(
                    '{"title":"Test Title", "description":"Test description", "creator":"Test creator"}',
                ),
            };

            const expectedLearningUnitDto: SearchLearningUnitCreationDto = {
                id: validMLSPostEvent.id,
                title: "Test Title",
                targetAudience: [],
                description: "Test description",
                contentCreator: "Test creator",
                teachingGoals: [],
                requiredSkills: [],
                lifecycle: LIFECYCLE.DRAFT,
            };

            // Act: Call the getEvent method
            let createdEntry = await eventService.getEvent(validMLSPostEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data (we cannot check object equality as the created DTO contains way more values)
            expect((createdEntry as SearchLearningUnitCreationDto).id).toEqual(
                expectedLearningUnitDto.id,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).title).toEqual(
                expectedLearningUnitDto.title,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).description).toEqual(
                expectedLearningUnitDto.description,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).contentCreator).toEqual(
                expectedLearningUnitDto.contentCreator,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).teachingGoals).toEqual(
                expectedLearningUnitDto.teachingGoals,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).requiredSkills).toEqual(
                expectedLearningUnitDto.requiredSkills,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).lifecycle).toEqual(
                expectedLearningUnitDto.lifecycle,
            );

            // Arrange: Define an update event
            const validMLSPutEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.PUT,
                id: "test1",
                payload: JSON.parse('{"description":"Updated test description"}'),
            };

            // Act: Call the getEvent method
            createdEntry = await eventService.getEvent(validMLSPutEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated description, other selected values unchanged)
            expect((createdEntry as SearchLearningUnitCreationDto).description).toEqual(
                "Updated test description",
            );
            expect((createdEntry as SearchLearningUnitCreationDto).teachingGoals).toEqual(
                expectedLearningUnitDto.teachingGoals,
            );
            expect((createdEntry as SearchLearningUnitCreationDto).lifecycle).toEqual(
                expectedLearningUnitDto.lifecycle,
            );

            // Arrange: Define a delete event
            const validMLSDeleteEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.DELETE,
                id: "test1",
                payload: JSON.parse('{"lifecycle":"DRAFT"}'), //We need this information as only draft units can be deleted
            };

            // Act: Call the getEvent method
            const returnedObject = await eventService.getEvent(validMLSDeleteEvent);

            // Assert: Check that the learning unit is successfully deleted
            expect(returnedObject).toEqual({
                message: `Learning Unit deleted successfully: test1`,
            });
        });

        it("should create a new learning unit when receiving a PUT event for a non-existent one", async () => {
            // Arrange: Create events with non-existent id
            const MlsPUTEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.PUT,
                id: "non-existent",
                payload: JSON.parse("{}"),
            };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(MlsPUTEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect((createdEntry as SearchLearningUnitCreationDto).id).toEqual("non-existent");
        });
    });

    /**
     * Positive tests for the event handling API for MLS users (our user profiles), testing all kinds of valid inputs.
     */
    describe("userCreationUpdateDeletion", () => {
        it("should create a valid user, update it, and then delete it", async () => {
            // Arrange: Define test data and create event input
            const validMLSPostEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.POST,
                id: "test1",
                payload: JSON.parse('{"name":"Test Name"}'),
            };

            const expectedUserDto: UserCreationDto = {
                id: validMLSPostEvent.id,
                name: "Test Name",
                status: USERSTATUS.ACTIVE, //Initially, users are created as active users
            };

            // Act: Call the getEvent method
            let createdEntry = await eventService.getEvent(validMLSPostEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data (we cannot check object equality as the created DTO contains way more values)
            expect((createdEntry as UserCreationDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserCreationDto).name).toEqual(expectedUserDto.name);
            expect((createdEntry as UserCreationDto).status).toEqual(expectedUserDto.status);

            // Arrange: Define an update event
            const validMLSPutEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "test1",
                payload: JSON.parse('{"state":"false"}'),
            };

            // Act: Call the getEvent method
            createdEntry = await eventService.getEvent(validMLSPutEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated state, other selected values unchanged)
            expect((createdEntry as UserCreationDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserCreationDto).name).toEqual(expectedUserDto.name);
            expect((createdEntry as UserCreationDto).status).toEqual(USERSTATUS.INACTIVE);

            //Update again as preparation for next test and to test the other branch
            const validMLSPutEvent2: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "test1",
                payload: JSON.parse('{"state":"true"}'),
            };

            // Act: Call the getEvent method
            createdEntry = await eventService.getEvent(validMLSPutEvent2);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated state, other selected values unchanged)
            expect((createdEntry as UserCreationDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserCreationDto).name).toEqual(expectedUserDto.name);
            expect((createdEntry as UserCreationDto).status).toEqual(USERSTATUS.ACTIVE);

            // Arrange: Define a delete event
            const validMLSDeleteEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.DELETE,
                id: "test1",
                payload: JSON.parse("{}"),
            };

            // Act: Call the getEvent method
            createdEntry = await eventService.getEvent(validMLSDeleteEvent);

            // Assert: Check that the user unit is successfully deleted (in our case this means setting status to inactive)
            expect((createdEntry as UserCreationDto).status).toEqual(USERSTATUS.INACTIVE);
        });

        it("should create a new user profile when receiving a PUT event for a non-existent one (when manually triggered in MLS for import)", async () => {
            // Arrange: Create events with non-existent id (but active state, as we do not create inactive users)
            const MlsPUTEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "non-existent",
                payload: JSON.parse('{"state":"true"}'),
            };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(MlsPUTEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect((createdEntry as UserCreationDto).id).toEqual("non-existent");
        });
    });
});
