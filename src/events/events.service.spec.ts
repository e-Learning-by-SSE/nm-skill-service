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
import { LearnedSkillDto, UserWithoutChildrenDto } from "../user/dto";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";
import { UnprocessableEntityException } from "@nestjs/common";

describe("Event Service", () => {
    //Required Classes
    const config = new ConfigService();
    const db = new PrismaService(config);
    const userService = new UserMgmtService(db);
    const learningUnitFactory = new LearningUnitFactory(db);
    const learningHistoryService = new LearningHistoryService(db, learningUnitFactory);
    const learningUnitService = new LearningUnitMgmtService(learningUnitFactory);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const eventService = new EventMgmtService(
        learningUnitService,
        config,
        userService,
        learningHistoryService,   
    );

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
                id: "invalidEntity",
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
                id: "invalidMethodTask",
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
                id: "invalidMethodUsers",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing action type for users
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting invalid method types for valid entities (taskTodoInfo)", async () => {
            // Arrange: Create events with invalid action types for taskTodoInfo
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.POST,
                id: "invalidMethodTaskToDoInfo",
                payload: JSON.parse("{}"),
            };

            // Act and assert: Call the getEvent method with a non-existing action type for taskTodoInfo
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to delete a task that is not in DRAFT mode", async () => {
            // Arrange: Create events with invalid mode for deletion
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.Task,
                method: MlsActionType.DELETE,
                id: "DeleteNotDraft",
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
                id: "DeleteUnknownStateUser",
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
                id: "UpdateUnknownStateUser",
                payload: JSON.parse('{"noState":"notRelevant"}'),
            };

            // Act and assert: Call the getEvent PUT method with missing state attribute for user
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when trying to get skills from a non-existing task (learning unit)", async () => {
            // Arrange: Create events with missing state attribute for a user update
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "GetSkillFromNonExistingTask",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"testEventId", "task":"non-existing"}',
                ),
            };

            // Act and assert: Call the getEvent PUT method with non-existent learning unit id
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should do nothing when there is no taught skill in the existing LU", async () => {
            // Arrange: Create events with missing skill in the LU

            //We need an existing user and a learning unit missing the skill
            const learningUnit = await dbUtils.createLearningUnit([], []);

            //We need the Ids for validation
            const userID = "testUserId";
            const luID = learningUnit.id;

            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "NoSkillInTask",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"' +
                        userID +
                        '", "task":"' +
                        luID +
                        '"}',
                ),
            };

            // Act and assert: Call the getEvent PUT method with non-existent task of learning unit
            //Expect the learning progress to be empty
            expect(eventService.getEvent(invalidMLSEvent)).toBeUndefined;
        });

        it("should do nothing when the scored points are below the threshold", async () => {
            // Arrange: Create events with points below threshold
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "ScoredPointsBelowThreshold",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"4", "maxPoints":10, "user":"notRelevant", "task":"notRelevant"}',
                ),
            };

            // Act: Call the getEvent PUT method with unfinished update
            const result = await eventService.getEvent(invalidMLSEvent);

            // Assert: Check that the output is as expected
            expect(result).toEqual("Nothing relevant happened");
        });

        it("should do nothing when the status is not finished", async () => {
            // Arrange: Create events with other status than finished
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "StatusIsNotFinished",
                payload: JSON.parse('{"status":"NotFINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"notRelevant", "task":"notRelevant"}',
                ),
            };

            // Act: Call the getEvent PUT method with unfinished update
            const result = await eventService.getEvent(invalidMLSEvent);

            // Assert: Check that the output is as expected
            expect(result).toEqual("Nothing relevant happened");
        });

        it("should throw errors when trying to teach a skill to a non-existing user", async () => {
            // Arrange: Create events with non-existent user id

            //We need an existing skill, skill map, and a learning unit teaching the skill
            const skillMap = await dbUtils.createSkillMap("owner", "Default Skill Map for Testing");
            const goalSkill = await dbUtils.createSkill(
                skillMap,
                "Taught Skill",
                [],
                "Description",
                1,
            );
            const learningUnit = await dbUtils.createLearningUnit([goalSkill], []);

            //We need the Ids for validation
            const luID = learningUnit.id;

            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "LearnSkillByNonExistentUser",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"non-existent", "task":"' +
                        luID +
                        '"}',
                ),
            };

            // Act and assert: Call the getEvent PUT method with non-existent user id
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw errors when getting a put event for a TaskToDoInfo with invalid payload", async () => {
            // Arrange: Create events with invalid payload
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "TaskToDoInfoWithInvalidPayload",
                payload: JSON.parse("{}"),
                taskTodoPayload: JSON.parse("{}"),
            };

            // Act: Call the getEvent PUT method with invalid payload
            const result = await eventService.getEvent(invalidMLSEvent);

            // Assert: Check that the output is as expected
            expect(result).toEqual("Nothing relevant happened");
        });

        it("should throw errors when getting a put event for a TaskToDoInfo with missing taskTodoPayload", async () => {
            // Arrange: Create events with missing taskTodoPayload
            const invalidMLSEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "TaskToDoInfoWithMissingTaskTodoPayload",
                payload: JSON.parse("{}"),
            };

            // Assert and Call: Check that the output is as expected
            await expect(eventService.getEvent(invalidMLSEvent)).rejects.toThrow(
                UnprocessableEntityException,
            );
        });
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
                targetAudience: [],
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
                payload: JSON.parse('{"contentCreator":"Updated test contentCreator"}'),
            };

            // Act: Call the getEvent method
            createdEntry = await eventService.getEvent(validMLSPutEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated contentCreator, other selected values unchanged)

            expect((createdEntry as SearchLearningUnitCreationDto).contentCreator).toEqual(
                expectedLearningUnitDto.contentCreator,
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
                //Initially, users are created as active users, so no status given
            };

            // Act: Call the getEvent method
            await eventService.getEvent(validMLSPostEvent);

            //Load the user from the DB
            let createdEntry = await userService.getUserById(expectedUserDto.id);

            // Assert: Check that the createdEntry is valid and matches the expected data (we cannot check object equality as the created DTO contains way more values)
            expect((createdEntry as UserWithoutChildrenDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserWithoutChildrenDto).status).toEqual(USERSTATUS.ACTIVE);

            // Arrange: Define an update event
            const validMLSPutEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "test1",
                payload: JSON.parse('{"state":"false"}'),
            };

            // Act: Call the getEvent method
            await eventService.getEvent(validMLSPutEvent);
            //Load the user from the DB
            createdEntry = await userService.getUserById(expectedUserDto.id);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated state, other selected values unchanged)
            expect((createdEntry as UserWithoutChildrenDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserWithoutChildrenDto).status).toEqual(USERSTATUS.INACTIVE);

            //Update again as preparation for next test and to test the other branch
            const validMLSPutEvent2: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.PUT,
                id: "test1",
                payload: JSON.parse('{"state":"true"}'),
            };

            // Act: Call the getEvent method
            await eventService.getEvent(validMLSPutEvent2);
            //Load the user from the DB
            createdEntry = await userService.getUserById(expectedUserDto.id);

            // Assert: Check that the createdEntry is valid and matches the expected data (updated state, other selected values unchanged)
            expect((createdEntry as UserWithoutChildrenDto).id).toEqual(expectedUserDto.id);
            expect((createdEntry as UserWithoutChildrenDto).status).toEqual(USERSTATUS.ACTIVE);

            // Arrange: Define a delete event
            const validMLSDeleteEvent: MLSEvent = {
                entityType: MlsActionEntity.User,
                method: MlsActionType.DELETE,
                id: "test1",
                payload: JSON.parse("{}"),
            };

            // Act: Call the getEvent method
            await eventService.getEvent(validMLSDeleteEvent);
            //Load the user from the DB
            createdEntry = await userService.getUserById(expectedUserDto.id);

            // Assert: Check that the user unit is successfully deleted (in our case this means setting status to inactive)
            expect((createdEntry as UserWithoutChildrenDto).status).toEqual(USERSTATUS.INACTIVE);
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
            await eventService.getEvent(MlsPUTEvent);

            //Load the user from the DB
            const createdEntry = await userService.getUserById(MlsPUTEvent.id);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect((createdEntry as UserWithoutChildrenDto).id).toEqual(MlsPUTEvent.id);
        });
    });

    /**
     * Positive tests for the event handling API for MLS taskToDoInfo events (when a user does something with a task), testing all kinds of valid inputs.
     */
    describe("successful task finish", () => {
        it("should create a valid learning progress linking user and skill", async () => {
            // Arrange: Define test data and create event input

            //We need an existing user, skill (requires a skillMap), and a learning unit teaching the skill
            const userID = "testUserId";
            await userService.createUser({ id: userID });
            const skillMap = await dbUtils.createSkillMap("owner", "Default Skill Map for Testing");
            const goalSkill = await dbUtils.createSkill(
                skillMap,
                "Taught Skill",
                [],
                "Description",
                1,
            );

            const teachingGoals = [goalSkill];
            const learningUnit = await dbUtils.createLearningUnit(teachingGoals, []);

            //We need the Ids for validation
            const skillID = goalSkill.id;
            const luID = learningUnit.id;

            //Create a valid MLS event
            const validMLSPostEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "validTaskToDoInfo",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"' +
                        userID +
                        '", "task":"' +
                        luID +
                        '"}',
                ),
            };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(validMLSPostEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data
            // Here, we expect an array of learning progress DTOs
            for (const entry of createdEntry as Array<LearnedSkillDto>) {
                //Skill id and user id should match the input
                expect(entry.skillId).toEqual(skillID);
                expect(entry.learningHistoryId).toEqual(userID);
            }
        });

        it("should create a valid learning progress for a task with 0 max points", async () => {
            // Arrange: Define test data and create event input

            //We need an existing user, skill (requires a skillMap), and a learning unit teaching the skill
            const userID = "testUserId";
            await userService.createUser({ id: userID });
            const skillMap = await dbUtils.createSkillMap("owner", "Default Skill Map for Testing");
            const goalSkill = await dbUtils.createSkill(
                skillMap,
                "Taught Skill",
                [],
                "Description",
                1,
            );

            const teachingGoals = [goalSkill];
            const learningUnit = await dbUtils.createLearningUnit(teachingGoals, []);

            //We need the Ids for validation
            const skillID = goalSkill.id;
            const luID = learningUnit.id;

            //Create a valid MLS event
            const validMLSPostEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "validTaskToDoInfoWith0MaxPoints",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"0", "maxPoints":0, "user":"' +
                        userID +
                        '", "task":"' +
                        luID +
                        '"}',
                ),
            };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(validMLSPostEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data
            // Here, we expect an array of learning progress DTOs
            for (const entry of createdEntry as Array<LearnedSkillDto>) {
                //Skill id and user id should match the input
                expect(entry.skillId).toEqual(skillID);
                expect(entry.learningHistoryId).toEqual(userID);
            }
        });

        it("should create several valid learning progress objects linking user and different skills", async () => {
            // Arrange: Define test data and create event input

            //We need an existing user, skills (requires a skillMap), and a learning unit teaching the skills
            const userID = "testUserId";
            await userService.createUser({ id: userID });
            const skillMap = await dbUtils.createSkillMap("owner", "Default Skill Map for Testing");
            const goalSkill1 = await dbUtils.createSkill(
                skillMap,
                "Taught Skill1",
                [],
                "Description1",
                1,
            );
            const goalSkill2 = await dbUtils.createSkill(
                skillMap,
                "Taught Skill2",
                [],
                "Description2",
                2,
            );
            const goalSkill3 = await dbUtils.createSkill(
                skillMap,
                "Taught Skill3",
                [],
                "Description3",
                3,
            );

            const teachingGoals = [goalSkill1, goalSkill2, goalSkill3];
            const learningUnit = await dbUtils.createLearningUnit(teachingGoals, []);

            //We need the Ids for validation
            const idArray = [goalSkill1.id, goalSkill2.id, goalSkill3.id];
            const luID = learningUnit.id;

            //Create a valid MLS event
            const validMLSPostEvent: MLSEvent = {
                entityType: MlsActionEntity.TaskToDoInfo,
                method: MlsActionType.PUT,
                id: "validTaskToDoInfo2",
                payload: JSON.parse('{"status":"FINISHED"}'),
                taskTodoPayload: JSON.parse(
                    '{"scoredPoints":"1", "maxPoints":1, "user":"' +
                        userID +
                        '", "task":"' +
                        luID +
                        '"}',
                ),
            };

            // Act: Call the getEvent method
            const createdEntry = await eventService.getEvent(validMLSPostEvent);

            // Assert: Check that the createdEntry is valid and matches the expected data

            //For comparing the ids
            let i = 0;

            // Here, we expect an array of learning progress DTOs
            for (const entry of createdEntry as Array<LearnedSkillDto>) {
                //Skill id and user id should match the input
                expect(entry.skillId).toEqual(idArray[i]);
                expect(entry.learningHistoryId).toEqual(userID);
                i++;
            }
        });
    });
});
