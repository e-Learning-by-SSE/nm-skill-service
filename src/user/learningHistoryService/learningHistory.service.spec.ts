import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningHistoryService } from "./learningHistory.service";
import { UserMgmtService } from "../user.service";
import { ForbiddenException } from "@nestjs/common";
import { LearningPath, LearningUnit, STATUS, Skill, SkillMap } from "@prisma/client";
import { LearningUnitFactory } from "../../learningUnit/learningUnitFactory";
import { PathFinderService } from "../../pathFinder/pathFinder.service";
import { PersonalizedPathDto } from "./dto/personalizedPath.dto";

describe("LearningHistoryService", () => {
    //Required classes
    const config = new ConfigService();
    const db = new PrismaService(config);
    const learningUnitFactoryService = new LearningUnitFactory(db);
    const dbUtils = DbTestUtils.getInstance();
    const userService = new UserMgmtService(db);
    const historyService = new LearningHistoryService(db, learningUnitFactoryService);
    const pathFinderService = new PathFinderService(db, learningUnitFactoryService, historyService);

    //Preparation of input data
    let skill1: Skill;
    let skill2: Skill;
    let skill3: Skill;
    const expectedUser1 = {
        id: "testUser1",
    };
    const expectedUser2 = {
        id: "testUser2",
    };
    // Test data, a pre-defined learning path with 3 units & skills
    let [unit1, unit2, unit3]: LearningUnit[] = [];
    let pathDefinition: LearningPath & { pathTeachingGoals: Skill[]; requirements: Skill[] };

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

        unit1 = await dbUtils.createLearningUnit([skill1], []);
        unit2 = await dbUtils.createLearningUnit([skill2], [skill1]);
        unit3 = await dbUtils.createLearningUnit([skill3], [skill2]);

        // Create learning path
        pathDefinition = await dbUtils.createLearningPath("teacher", [skill3]);
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
            // Act (enroll the user in the path and store it to their learning history)
            const result = await pathFinderService.enrollment(
                expectedUser2.id,
                pathDefinition.id,
                true, //Needs to be true for path to be added to the history
            );

            // Assert: All 3 units are part of path; Path was saved
            const expected: PersonalizedPathDto = {
                learningPathId: pathDefinition.id,
                personalizedPathId: expect.any(String),
                learningUnitInstances: [
                    { uniInstanceId: unit1.id, status: STATUS.OPEN },   //This is wrong, the unitInstanceIds should not be the unit ids?
                    { uniInstanceId: unit2.id, status: STATUS.OPEN },
                    { uniInstanceId: unit3.id, status: STATUS.OPEN },
                ],
                goals: [],
                status: STATUS.OPEN,
            };

            expect(result).toMatchObject(expected);

            // Receive the list of all personal paths for the user
            const personalPaths = await historyService.getPersonalizedPathsOfUser(expectedUser2.id);
            const pathId = personalPaths.paths[0].personalizedPathId;
            const personalPath = await historyService.getPersonalizedPath(pathId);

            // Assert: Check the results (there should now be one personal path)
            expect(personalPaths.paths).toHaveLength(1);
            expect(personalPaths.paths[0].learningPathId).toEqual(expected.learningPathId);
            expect(personalPaths.paths[0].status).toEqual(expected.status);

            expect(personalPath?.personalizedPathId).toEqual(pathId);
            expect(personalPath?.learningPathId).toEqual(expected.learningPathId);
            expect(personalPath?.status).toEqual(expected.status);
            expect(personalPath?.learningUnitInstances).toEqual(expected.learningUnitInstances);
            expect(personalPath?.goals).toEqual(expected.goals);
        });

        it("should update the status of the learning unit instance and the personal path", async () => {
            //This test case is dependent on the previous test case

            // Act (update the status of the first unit to IN_PROGRESS)
            await historyService.updateLearningUnitInstanceAndPersonalizedPathStatus(
                expectedUser2.id,
                unit1.id,
                STATUS.IN_PROGRESS,
            );

            // Receive the list of all personal paths for the user
            const personalPaths = await historyService.getPersonalizedPathsOfUser(expectedUser2.id);
            const pathId = personalPaths.paths[0].personalizedPathId;
            const personalPath = await historyService.getPersonalizedPath(pathId);

            // Assert: Check the results (there should now be one personal path)
            expect(personalPaths.paths).toHaveLength(1);
            expect(personalPaths.paths[0].status).toEqual(STATUS.IN_PROGRESS); //Path status should be now be IN_PROGRESS (as at least one task is started)
            expect(personalPath?.learningUnitInstances[0].status).toEqual(STATUS.IN_PROGRESS); //Unit 1 should be IN_PROGRESS
            expect(personalPath?.learningUnitInstances[1].status).toEqual(STATUS.OPEN); //Unit 2 should be unchanged
            expect(personalPath?.learningUnitInstances[2].status).toEqual(STATUS.OPEN); //Unit 3 should be unchanged
        });
    });
});
