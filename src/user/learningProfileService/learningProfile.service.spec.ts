import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningProfileService } from "./learningProfile.service";
import { LearningProfileDto } from "../dto";
import { UserMgmtService } from "../user.service";

describe("LearningProfileService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();
    const userService = new UserMgmtService(db);
    const learningProfileService = new LearningProfileService(db);

    beforeAll(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    afterAll(async () => {
        // Wipe DB after all tests
        await dbUtils.wipeDb();
        await db.$disconnect();
    });

    describe("createAndUpdateLearningProfile", () => {
        it("Creates a new user profile together with a new empty learningProfile", async () => {
            // Arrange: Create a user object
            const expectedUser = {
                id: "testUser",
            };
            //Create the user and save it to the DB (this should create a new empty user profile)
            await userService.createUser(expectedUser);

            // Act: Call the getLearningProfile method and receive the learning profile as DTO
            const createdLearningProfile = await learningProfileService.getLearningProfileByID(
                expectedUser.id,
            );

            // Assert: Check the result
            expect(createdLearningProfile).toBeInstanceOf(LearningProfileDto);
            expect(createdLearningProfile.id).toEqual(expectedUser.id);
            //Check default values
            expect(createdLearningProfile.semanticDensity).toEqual(0);
            expect(createdLearningProfile.semanticGravity).toEqual(0);
            expect(createdLearningProfile.mediaType).toEqual([]);
            expect(createdLearningProfile.language).toEqual([]);
            expect(createdLearningProfile.processingTimePerUnit).toEqual(0);
            expect(createdLearningProfile.preferredDidacticMethod).toEqual([]);
        });

        it("Updates an existing learningProfile with one value", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //User entry should persist in the DB

            //Create a learningProfile with a semanticDensity of 0.5
            const updateDto = {
                id: expectedUserId,
                semanticDensity: 0.5,
            };
            // Act: Update the learningProfile
            await learningProfileService.updateLearningProfile(updateDto);

            // Call the getLearningProfile method and receive the learning profile as DTO
            const updatedLearningProfile = await learningProfileService.getLearningProfileByID(
                expectedUserId,
            );

            // Assert: Check the result (these should be the unchanged default values)
            expect(updatedLearningProfile).toBeInstanceOf(LearningProfileDto);
            expect(updatedLearningProfile.id).toEqual(expectedUserId);
            expect(updatedLearningProfile.semanticGravity).toEqual(0);
            expect(updatedLearningProfile.mediaType).toEqual([]);
            expect(updatedLearningProfile.language).toEqual([]);
            expect(updatedLearningProfile.processingTimePerUnit).toEqual(0);
            expect(updatedLearningProfile.preferredDidacticMethod).toEqual([]);
            //Check updated values
            expect(updatedLearningProfile.semanticDensity).toEqual(updateDto.semanticDensity);
        });

        it("Updates an existing learningProfile with multiple values", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //User entry should persist in the DB

            //Create a learningProfile with multiple values to be changed
            const updateDto = {
                id: expectedUserId,
                semanticGravity: 0.3,
                mediaType: ["application/pdf", "video/mp4"],
                language: ["en", "de"],
                processingTimePerUnit: 30,
                preferredDidacticMethod: ["lecture", "tutorial"],
            };

            //Act: Update the learningProfile
            await learningProfileService.updateLearningProfile(updateDto);

            // Call the getLearningProfile method and receive the learning profile as DTO
            const updatedLearningProfile = await learningProfileService.getLearningProfileByID(
                expectedUserId,
            );

            // Assert: Check the results which should be the same as before
            expect(updatedLearningProfile).toBeInstanceOf(LearningProfileDto);
            expect(updatedLearningProfile.id).toEqual(expectedUserId);
            expect(updatedLearningProfile.semanticDensity).toEqual(0.5);
            //Check updated values
            expect(updatedLearningProfile.semanticGravity).toEqual(updateDto.semanticGravity);
            expect(updatedLearningProfile.mediaType).toEqual(updateDto.mediaType);
            expect(updatedLearningProfile.language).toEqual(updateDto.language);
            expect(updatedLearningProfile.processingTimePerUnit).toEqual(
                updateDto.processingTimePerUnit,
            );
            expect(updatedLearningProfile.preferredDidacticMethod).toEqual(
                updateDto.preferredDidacticMethod,
            );
        });

        it("rejects to update a non-existing learningProfile", async () => {
            // Arrange: Create a user object with a non-existing ID
            const nonExistentUserId = "nonExistingTestUser";

            //Create a learningProfile with a semanticDensity of 0.5
            const updateDto = {
                id: nonExistentUserId,
                semanticDensity: 0.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (density above 1)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                semanticDensity: 1.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (density below 0)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                semanticDensity: -0.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (gravity below 0)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                semanticGravity: -0.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (gravity above 1)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                semanticGravity: 1.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (negative processing time)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                processingTimePerUnit: -30,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });

        it("rejects to update a learningProfile with invalid values (non integer processing time)", async () => {
            // Arrange: Create a user object (whose id is the same as the learningProfile id)
            const expectedUserId = "testUser";

            //Create a learningProfile with invalid values
            const updateDto = {
                id: expectedUserId,
                processingTimePerUnit: 30.5,
            };

            // Act and Assert: Check if the user update was rejected correctly
            await expect(learningProfileService.updateLearningProfile(updateDto)).rejects.toThrow();
        });
    });
});
