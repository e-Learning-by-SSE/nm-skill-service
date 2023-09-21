import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { UserMgmtService } from "./user.service";
import { LearningProgress, SkillMap, UserProfile } from "@prisma/client";
import { Skill } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";
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
