import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { UserMgmtService } from "./user.service";
import { ConsumedUnitData, LearningProgress, LearningUnit, STATUS, SkillMap, UserProfile } from "@prisma/client";
import { Skill } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";
import { CreateLearningProgressDto } from "./dto/learningProgress-creation.dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { SearchLearningUnitCreationDto } from "../learningUnit/dto/learningUnit-creation.dto";
describe("User Service", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const userService = new UserMgmtService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });
    describe("editStatusForAConsumedUnit", () => {
        let userProf: UserProfile;
        let consumedUnit: ConsumedUnitData;
        let lu : LearningUnit;
        let factory: LearningUnitFactory;
        beforeEach(async () => {
            await dbUtils.wipeDb();
            factory = new LearningUnitFactory(db);
            userProf = await db.userProfile.create({
                data: {
                    name: "TestUser",
                    status: "ACTIVE",
                    id: "testId",
                },
            });
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
            });
            const result = await factory.createLearningUnit(creationDto);
            
            const learningBehaviorData = await db.learningBehaviorData.create({
                data: {
                  userId: userProf.id,
                  // other fields...
                },
              });

            consumedUnit = await db.consumedUnitData.create({
                data: {
                    actualPocessingTime: "2 hours",
                    testPerformance: 0.85,
                    consumedLUId: result.id, 
                    lbDataId: learningBehaviorData.id, 
                    status: "STARTED",
                    date: new Date(),
                   
                },
            });
        });



        it("should edit the status for a consumed unit", async () => {
            // Arrange: Define test data
            const userId = userProf.id;
            const consumedUnitId = consumedUnit.id;
            const newStatus:STATUS = STATUS.FINISHED; // Replace with the desired status

            // Act: Call the editStatusForAConsumedUnit method
            const result = await userService.editStatusForAConsumedUnit(userId, consumedUnitId, newStatus);

            // Assert: Check that the result is defined and has the expected structure
            expect(result).toBeDefined();
            expect(result.id).toEqual(consumedUnitId);
            expect(result.status).toEqual(newStatus);

            // Assert: Check the database state after the test
            const updatedConsumedUnit = await db.consumedUnitData.findUnique({
                where: { id: consumedUnitId },
            });

            // Check that the consumed unit in the database has the updated status
            expect(updatedConsumedUnit).toBeDefined();
            expect(updatedConsumedUnit?.status).toEqual(newStatus);
        });

        it("should handle errors when editing the status for a consumed unit", async () => {
            // Arrange: Define test data that may cause an error
            const invalidUserId = "non-existent-user"; // An invalid user ID
            const invalidConsumedUnitId = "non-existent-consumed-unit"; // An invalid consumed unit ID
            const newStatus:STATUS = STATUS.FINISHED;

            // Act and Assert: Call the editStatusForAConsumedUnit method and expect it to throw an error
            await expect(
                userService.editStatusForAConsumedUnit(invalidUserId, invalidConsumedUnitId, newStatus),
            ).rejects.toThrowError(NotFoundException);
        });
    });

    describe("createLearningPathForUser", () => {
        let userProf: UserProfile;
        let skillMap1: SkillMap;
        let skill1: Skill;
    
        beforeEach(async () => {
            await dbUtils.wipeDb();
    
            userProf = await db.userProfile.create({
                data: {
                    name: "TestUser",
                    status: "ACTIVE",
                    id: "testId",
                },
            });
    
            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
    
            skill1 = await dbUtils.createSkill(skillMap1, "Skill 1", []);
        });
    
        it("should create a personalized learning path for a user", async () => {
            // Arrange: Define test data
            const userId = userProf.id;
            const learningUnitsIds:string [] = [];
            const pathTeachingGoalsIds :string [] = [];
    
            // Act: Call the createLearningPathForUser method
            const result = await userService.createLearningPathForUser(
                userId,
                learningUnitsIds,
                pathTeachingGoalsIds,
            );
    
            // Assert: Check that the result is defined and has the expected structure
            expect(result.createdPersonalizedLearningPath).toBeDefined();
            expect(result.createdPersonalizedLearningPath.id).toBeDefined();
            expect(result.createdPersonalizedLearningPath.createdAt).toBeDefined();
            expect(result.createdPersonalizedLearningPath.updatedAt).toBeDefined();
    
            // Assert: Check the database state after the test
            const createdPathFromDb = await db.personalizedLearningPath.findUnique({
                where: { id: result.createdPersonalizedLearningPath.id },
                include: { unitSequence: true, pathTeachingGoals: true },
            });
    
            // Check that the created path is in the database and has the expected associations
            expect(createdPathFromDb).toBeDefined();
            if (createdPathFromDb) {
                expect(createdPathFromDb.unitSequence).toHaveLength(learningUnitsIds.length);
                expect(createdPathFromDb.pathTeachingGoals).toHaveLength(pathTeachingGoalsIds.length);
            }
            
        });
    
     
    });

    describe("createProgressForUserId", () => {
        let userProf: UserProfile;
        let skillMap1: SkillMap;
        let skill1: Skill;
        let lePro: LearningProgress;
        beforeEach(async () => {
            await dbUtils.wipeDb();
            userProf = await db.userProfile.create({
                data: {
                    name: "TestUser",
                    status: "ACTIVE",
                    id: "testId",
                },
            });
            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            skill1 = await dbUtils.createSkill(skillMap1, "Skill 1", []);
        });
        it("should create a learning progress entry", async () => {
            // Arrange: Define test data
            const userId = userProf.id; // Replace with a valid user ID
            const createLearningProgressDto: CreateLearningProgressDto = {
                skillId: skill1.id,
            };

            // Act: Call the createProgressForUserId method
            const createdEntry = await userService.createProgressForUserId(
                userId,
                createLearningProgressDto,
            );

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect(createdEntry).toBeDefined();
            // Add more assertions based on your DTO and data structure
        });

        it("should handle errors when creating a learning progress entry", async () => {
            // Arrange: Define test data that may cause an error
            const invalidUserId = "non-existent-user"; // An invalid user ID
            const createLearningProgressDto: CreateLearningProgressDto = {
                skillId: skill1.id,
            };
            // Act and Assert: Call the createProgressForUserId method and expect it to throw an error
            await expect(
                userService.createProgressForUserId(invalidUserId, createLearningProgressDto),
            ).rejects.toThrowError("Error creating learning progress.");
        });
    });
    describe("findProgressForUserId", () => {
        let userProf: UserProfile;
        let skillMap1: SkillMap;
        let skill1: Skill;
        let lePro: LearningProgress;
        beforeEach(async () => {
            await dbUtils.wipeDb();
            userProf = await db.userProfile.create({
                data: {
                    name: "TestUser",
                    status: "ACTIVE",
                    id: "testId",
                },
            });
            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            skill1 = await dbUtils.createSkill(skillMap1, "Skill 1", []);
            lePro = await db.learningProgress.create({
                data: {
                    skillId: skill1.id,
                    userId: userProf.id,
                },
            });
        });
        it("should find learning progress entries for a user", async () => {
            // Arrange: Define a valid user ID for which you expect progress entries
            const userId = userProf.id; // Replace with a valid user ID

            // Act: Call the findProgressForUserId method
            const progressEntries = await userService.findProgressForUserId(userId);

            // Assert: Check that progressEntries is an array and contains expected data
            expect(Array.isArray(progressEntries)).toBe(true);
            // Add more assertions based on your data structure
        });

        it("should handle errors when finding learning progress entries", async () => {
            // Arrange: Define an invalid user ID that may cause an error
            const invalidUserId = "non-existent-user"; // An invalid user ID

            // Act and Assert: Call the findProgressForUserId method and expect it to throw an error
            await expect(userService.findProgressForUserId(invalidUserId)).rejects.toThrowError(
                "Error finding learning progress.",
            );
        });
    });

    describe("deleteLearningProgress", () => {
        let userProf: UserProfile;
        let skillMap1: SkillMap;
        let skill1: Skill;
        let lePro: LearningProgress;
        beforeEach(async () => {
            await dbUtils.wipeDb();
            userProf = await db.userProfile.create({
                data: {
                    name: "TestUser",
                    status: "ACTIVE",
                    id: "testId",
                },
            });
            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            skill1 = await dbUtils.createSkill(skillMap1, "Skill 1", []);
            lePro = await db.learningProgress.create({
                data: {
                    skillId: skill1.id,
                    userId: userProf.id,
                },
            });
        });
        it("should delete a learning progress entry", async () => {
            const result = await userService.deleteProgressForId(lePro.id);

            // Assert that the result matches the expected value
            expect(result).toEqual(lePro);
        });

        it("should handle errors when deleting a learning progress entry", async () => {
            const nonExistentId = "non-existent-id";

            // Use try...catch to handle the expected NotFoundException
            try {
                await userService.deleteProgressForId(nonExistentId);

                // If the deletion does not throw an exception, fail the test
                fail("Expected NotFoundException was not thrown.");
            } catch (error) {
                // Check if the error is an instance of NotFoundException and has the expected message
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Record not found: ${nonExistentId}`);
            }
        });
    });
});
