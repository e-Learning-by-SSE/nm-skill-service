import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { UserMgmtService } from "./user.service";
import {
    LearningPath,
    LearningUnit,
    STATUS,
    Skill,
    SkillMap,
    USERSTATUS,
    UserProfile,
} from "@prisma/client";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { NotFoundException } from "@nestjs/common";
import { LearningHistoryService } from "./learningHistoryService/learningHistory.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";

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

    describe("loadUser", () => {
        // Auxiliary
        const luFactory = new LearningUnitFactory(db);
        const historyService = new LearningHistoryService(db, luFactory);

        // Test data, a pre-defined learning path with 3 units & skills
        let skillMap: SkillMap;
        let [skill1, skill2, skill3]: Skill[] = [];
        let [unit1, unit2, unit3]: LearningUnit[] = [];
        let pathDef1: LearningPath & { pathTeachingGoals: Skill[]; requirements: Skill[] };
        let pathDef2: LearningPath & { pathTeachingGoals: Skill[]; requirements: Skill[] };
        let learner: UserProfile;

        beforeEach(async () => {
            await dbUtils.wipeDb();

            // Create skills
            skillMap = await dbUtils.createSkillMap("teacher", "Skill Map 1");
            skill1 = await dbUtils.createSkill(skillMap, "Skill 1");
            skill2 = await dbUtils.createSkill(skillMap, "Skill 2");
            skill3 = await dbUtils.createSkill(skillMap, "Skill 3");

            // Create learning units
            unit1 = await dbUtils.createLearningUnit([skill1], []);
            unit2 = await dbUtils.createLearningUnit([skill2], [skill1]);
            unit3 = await dbUtils.createLearningUnit([skill3], [skill2]);

            // Create learning path
            pathDef1 = await dbUtils.createLearningPath("teacher", [skill3]);
            pathDef2 = await dbUtils.createLearningPath("teacher", [skill3], [skill1]);

            // Create a learner
            learner = await dbUtils.createUserProfile("learner");
        });

        it("Existing user; Empty profile -> Empty profile", async () => {
            // Act: Load the user profile
            const user = await userService.loadUserProfile(learner.id);

            // Assert: Check if the user profile was loaded correctly
            // General
            expect(user).toBeDefined();
            expect(user.id).toEqual(learner.id);
            expect(user.status).toEqual("ACTIVE");
            // Learning History
            expect(user.learningHistory!.userId).toEqual(learner.id);
            expect(user.learningHistory!.learnedSkills).toEqual([]);
            expect(user.learningHistory!.personalPaths).toEqual([]);
            // Career Profile
            expect(user.careerProfile!.userId).toEqual(learner.id);
            expect(user.careerProfile!.professionalInterests).toEqual([]);
            expect(user.careerProfile!.selfReportedSkills).toEqual([]);
            // Learning Profile
            expect(user.learningProfile!.userId).toEqual(learner.id);
            expect(user.learningProfile!.mediaType).toEqual([]);
            expect(user.learningProfile!.preferredDidacticMethod).toEqual([]);
            expect(user.learningProfile!.processingTimePerUnit).toEqual(0);
            expect(user.learningProfile!.semanticDensity).toEqual(0);
            expect(user.learningProfile!.semanticGravity).toEqual(0);
        });

        it("Existing user; 2 partially paths learned -> List of paths/learned skills included", async () => {
            // Enroll into 2 paths and partially finish them
            await historyService.addPersonalizedLearningPathToUser({
                userId: learner.id,
                learningUnitsIds: [unit1.id, unit2.id, unit3.id],
                pathId: pathDef1.id,
            });
            await historyService.addPersonalizedLearningPathToUser({
                userId: learner.id,
                learningUnitsIds: [unit2.id, unit3.id],
                pathId: pathDef2.id,
            });
            await historyService.updateLearningUnitInstanceAndPersonalizedPathStatus(
                learner.id,
                unit1.id,
                STATUS.FINISHED,
            );
            await historyService.updateLearningUnitInstanceAndPersonalizedPathStatus(
                learner.id,
                unit2.id,
                STATUS.FINISHED,
            );

            // Act: Load the user profile
            const user = await userService.loadUserProfile(learner.id);

            const expectedSkills = [
                {
                    Skill: expect.objectContaining({
                        id: skill1.id,
                        name: skill1.name,
                        repositoryId: skillMap.id,
                    }),
                },
                {
                    Skill: expect.objectContaining({
                        id: skill2.id,
                        name: skill2.name,
                        repositoryId: skillMap.id,
                    }),
                },
            ];
            const expectedPaths = [
                expect.objectContaining({
                    learningPathId: pathDef1.id,
                }),
                expect.objectContaining({
                    learningPathId: pathDef2.id,
                }),
            ];

            // Assert: Check if the user profile was loaded correctly
            expect(user.id).toEqual(learner.id);
            expect(user.status).toEqual("ACTIVE");
            expect(user.learningHistory!.learnedSkills).toMatchObject(expectedSkills);
            expect(user.learningHistory!.personalPaths).toMatchObject(expectedPaths);
        });

        it("Non-Existing user -> NotFoundException", async () => {
            // Act and Assert: Check if the user loading was rejected correctly
            await expect(userService.loadUserProfile("nonExistingUser")).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
