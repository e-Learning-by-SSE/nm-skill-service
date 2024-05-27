import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningHistoryService } from "./learningHistory.service";
import { UserMgmtService } from "../user.service";
import { ForbiddenException } from "@nestjs/common";
import { STATUS, Skill } from "@prisma/client";

describe("LearningHistoryService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();
    const userService = new UserMgmtService(db);
    let skill1: Skill;
    let skill2: Skill;
    let skill3: Skill;
    const expectedUser1 = {
        id: "testUser1",
    };
    const expectedUser2 = {
        id: "testUser2",
    };

    // Object under test
    const historyService = new LearningHistoryService(db, config);

    beforeAll(async () => {
        // Wipe DB once before test (as we reuse data)
        await dbUtils.wipeDb();

        // Learning units and skills to be reused in the tests
        const skillMap1 = await db.skillMap.create({
            data: {
                name: "First Map",
                ownerId: "User-1",
            },
        });

        skill1 = await dbUtils.createSkill(skillMap1, "Skill 1", []);
        skill2 = await dbUtils.createSkill(skillMap1, "Skill 2", []);
        skill3 = await dbUtils.createSkill(skillMap1, "Skill 3", []);
    });

    afterAll(async () => {
        // Wipe DB after all tests
        await dbUtils.wipeDb();
        await db.$disconnect();
    });

    describe("createAndUpdateLearningHistoriesLearnedSkills", () => {
        it("should create an empty Learning History", async () => {
            // Test precondition: No history entries exist
            const nHistories = await db.learningHistory.count();
            expect(nHistories).toEqual(0);

            //Act: Create the user and save it to the DB (this should create a new empty user profile, including an empty learning history)
            await userService.createUser(expectedUser1);

            // Assert: Check the results (there should now be an empty learning history with empty learnedSkills and empty personalPaths)
            const createdHistory = await db.learningHistory.findUnique({
                where: { userId: expectedUser1.id },
                include: { learnedSkills: true, personalPaths: true },
            });
            expect(createdHistory).toBeDefined();
            expect(createdHistory?.learnedSkills).toEqual([]);
            expect(createdHistory?.personalPaths).toEqual([]);
            expect(createdHistory?.userId).toEqual(expectedUser1.id);
        });

        it("should update the learning history with a newly learned skill", async () => {
            //Act: Add a learned skill to the learning history
            await historyService.addLearnedSkillToUser(expectedUser1.id, skill1.id);

            // Receive the list of learned skills for the user
            const learnedSkills = await historyService.getLearnedSkillsOfUser(expectedUser1.id);

            // Assert: Check the results (there should now be one learned skill)
            expect(learnedSkills).toHaveLength(1);
            expect(learnedSkills[0]).toEqual(skill1.id);
        });

        it("should not update the learning history with a non existent skill", async () => {
            //Act and assert: Reject to add a non-existent skill to the learning history
            await expect(
                historyService.addLearnedSkillToUser(expectedUser1.id, "non-existent"),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should not update the learning history of a non existent user", async () => {
            //Act and assert: Reject to add a learned skill to a non-existent user
            await expect(
                historyService.addLearnedSkillToUser("non-existent", skill2.id),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should update the learning history with multiple learned skills", async () => {
            //Act: Add multiple learned skills to the learning history
            await historyService.addLearnedSkillToUser(expectedUser1.id, skill2.id);
            await historyService.addLearnedSkillToUser(expectedUser1.id, skill3.id);

            // Receive the list of learned skills for the user
            const learnedSkills = await historyService.getLearnedSkillsOfUser(expectedUser1.id);

            // Assert: Check the results (there should now be three learned skills, retrieved in the order they have been learned)
            expect(learnedSkills).toHaveLength(3);
            expect(learnedSkills[2]).toEqual(skill1.id);
            expect(learnedSkills[1]).toEqual(skill2.id);
            expect(learnedSkills[0]).toEqual(skill3.id);
        });

        it("should allow a user to learn a skill a second time", async () => {
            //Act: Add an already learned skill to the learning history
            await historyService.addLearnedSkillToUser(expectedUser1.id, skill1.id);

            // Receive the list of learned skills for the user
            const learnedSkills = await historyService.getLearnedSkillsOfUser(expectedUser1.id);

            // Assert: Check the results (the additional skill should now be contained twice (first and last), and the other skills should be unchanged)
            expect(learnedSkills).toHaveLength(4);
            expect(learnedSkills[3]).toEqual(skill1.id);
            expect(learnedSkills[2]).toEqual(skill2.id);
            expect(learnedSkills[1]).toEqual(skill3.id);
            expect(learnedSkills[0]).toEqual(skill1.id);
        });
    });

    describe("createAndUpdateLearningHistoriesPersonalizedPaths", () => {
        it("should create an empty Learning History", async () => {
            //Act: Create the user and save it to the DB (this should create a new empty user profile, including an empty learning history)
            await userService.createUser(expectedUser2);

            // Assert: Check the results (there should now be an empty learning history with empty learnedSkills and empty personalPaths)
            const createdHistory = await db.learningHistory.findUnique({
                where: { userId: expectedUser2.id },
                include: { learnedSkills: true, personalPaths: true },
            });
            expect(createdHistory).toBeDefined();
            expect(createdHistory?.learnedSkills).toEqual([]);
            expect(createdHistory?.personalPaths).toEqual([]);
            expect(createdHistory?.userId).toEqual(expectedUser2.id);
        });

        it("should update the learning history with a newly created personal path", async () => {
            //Act: Add a personal path to the learning history
            await historyService.addPersonalizedLearningPathToUser({
                userId: expectedUser2.id,
                learningUnitsIds: [],
                pathTeachingGoalsIds: [],
            }); // This function needs revision

            // Receive the list of all personal paths for the user
            const personalPaths = await historyService.getPersonalizedPathsOfUser(expectedUser2.id);
            const pathId = personalPaths.paths[0].personalizedPathId;
            const personalPath = await historyService.getPersonalizedPath(pathId);

            // Assert: Check the results (there should now be one personal path)
            expect(personalPaths.paths).toHaveLength(1);
            expect(personalPaths.paths[0].learningPathId).toEqual(null);
            expect(personalPaths.paths[0].status).toEqual(STATUS.OPEN);
            expect(personalPath?.personalizedPathId).toEqual(pathId);
            expect(personalPath?.learningPathId).toEqual(null);
            expect(personalPath?.status).toEqual(STATUS.OPEN);
            expect(personalPath?.learningUnits).toEqual([]);
            expect(personalPath?.goals).toEqual([]);
        });
    });
});
