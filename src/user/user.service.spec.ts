import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { UserMgmtService } from "./user.service";
import { USERSTATUS } from "@prisma/client";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common";

describe("User Service", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();
    const userService = new UserMgmtService(db);

    beforeAll(async () => {
        // Wipe DB before test suite (not before each test, as we build upon the created DB entries)
        await dbUtils.wipeDb();
    });

    afterAll(async () => {
        // Wipe DB after tests are finished
        await dbUtils.wipeDb();
        await db.$disconnect();
    });

    //Different positive and negative test cases for creation and update of users
    describe("createUpdateUserProfilesAndRejectInvalidRequests", () => {
        it("should create a user", async () => {
            // Arrange: Create a user object
            const expectedUser = {
                id: "testUser",
            };

            // Act: Create the user and save it to the DB
            await userService.createUser(expectedUser);

            // Get the user
            const createdUserDTO = await userService.getUserById(expectedUser.id);

            // Assert: Check if the user was created correctly
            expect(createdUserDTO).toBeDefined();
            expect(createdUserDTO?.id).toEqual(expectedUser.id);
            expect(createdUserDTO?.status).toEqual("ACTIVE");
            expect(createdUserDTO?.learningHistoryId).toEqual(expectedUser.id);
            expect(createdUserDTO?.careerProfileId).toEqual(expectedUser.id);
            expect(createdUserDTO?.learningProfileId).toEqual(expectedUser.id);
        });

        it("should not create a user if it already exists", async () => {
            // Arrange: Create a user object (which is already in the db)
            const expectedUser = {
                id: "testUser",
            };

            // Act and Assert: Check if the user creation was rejected correctly
            expect(async () => {
                await userService.createUser(expectedUser);
            }).rejects.toThrow(ForbiddenException);
        });

        it("should update a user", async () => {
            // Arrange: Create a user object
            const expectedUser = {
                id: "testUser",
                status: "INACTIVE",
            };

            // Act: Update the user in the DB
            await userService.patchUserState(expectedUser.id, expectedUser.status as USERSTATUS);

            // Get the user
            const updatedUserDTO = await userService.getUserById(expectedUser.id);

            // Assert: Check if the user was updated correctly
            expect(updatedUserDTO).toBeDefined();
            expect(updatedUserDTO?.id).toEqual(expectedUser.id);
            expect(updatedUserDTO?.status).toEqual("INACTIVE");
            expect(updatedUserDTO?.learningHistoryId).toEqual(expectedUser.id);
            expect(updatedUserDTO?.careerProfileId).toEqual(expectedUser.id);
            expect(updatedUserDTO?.learningProfileId).toEqual(expectedUser.id);
        });

        it("should not update a user that does not exist", async () => {
            // Arrange: Create a user object with a non-existing ID
            const expectedUser = {
                id: "nonExistingTestUser",
                status: "INACTIVE",
            };

            // Assert: Check if the user update was rejected correctly
            expect(async () => {
                await userService.patchUserState(
                    expectedUser.id,
                    expectedUser.status as USERSTATUS,
                );
            }).rejects.toThrow(ForbiddenException);
        });

        it("should not update a user with an invalid status", async () => {
            // Arrange: Create a user object with an invalid status
            const expectedUser = {
                id: "testUser",
                status: "INVALID",
            };

            // Assert: Check if the user update was rejected correctly
            expect(async () => {
                await userService.patchUserState(
                    expectedUser.id,
                    expectedUser.status as USERSTATUS,
                );
            }).rejects.toThrow(ForbiddenException);
        });

        it("should not update a user with an empty status", async () => {
            // Arrange: Create a user object with an empty status
            const expectedUser = {
                id: "testUser",
                status: "",
            };

            // Assert: Check if the user update was rejected correctly
            expect(async () => {
                await userService.patchUserState(
                    expectedUser.id,
                    expectedUser.status as USERSTATUS,
                );
            }).rejects.toThrow(ForbiddenException);
        });

        it("should not return a non-existing user", async () => {
            // Arrange: Create a user object with a non-existing ID
            const nonExistentUserId = "nonExistingTestUser";

            // Act and Assert: Check if the user update was rejected correctly
            await expect(userService.getUserById(nonExistentUserId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
