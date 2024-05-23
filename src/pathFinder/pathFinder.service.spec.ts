import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { DbTestUtils } from "../DbTestUtils";
import { PathFinderService } from "./pathFinder.service";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { LearningPath, LearningUnit, STATUS, Skill, SkillMap, UserProfile } from "@prisma/client";
import { EnrollmentPreviewResponseDto, EnrollmentResponseDto } from "./dto";

describe("LearningHistoryService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const luFactory = new LearningUnitFactory(db);
    const historyService = new LearningHistoryService(db, config);
    const dbUtils = DbTestUtils.getInstance();

    // Object under test
    const pathFinderService = new PathFinderService(db, luFactory, historyService);

    /**
     * Test cases for the enrollment/inspection into pre-defined learning paths.
     */
    describe("enrollment (Learning Path based)", () => {
        // Test data, a pre-defined learning path with 3 units & skills
        let skillMap: SkillMap;
        let [skill1, skill2, skill3]: Skill[] = [];
        let [unit1, unit2, unit3]: LearningUnit[] = [];
        let pathDefinition: LearningPath & { pathTeachingGoals: Skill[]; requirements: Skill[] };
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
            pathDefinition = await dbUtils.createLearningPath("teacher", [skill3]);

            // Create a learner
            learner = await dbUtils.createUserProfile("learner");
        });

        describe("Without background knowledge", () => {
            it("Inspect (without saving path)", async () => {
                // Precondition: No personalized learning paths
                let history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);

                // Act
                const result = await pathFinderService.enrollment(
                    learner.id,
                    pathDefinition.id,
                    false,
                );

                // Assert: All 3 units are part of path; Path not saved
                const expected: EnrollmentPreviewResponseDto = {
                    learningPathId: pathDefinition.id,
                    learningUnits: [unit1.id, unit2.id, unit3.id],
                };
                expect(result).toMatchObject(expected);
                history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);
            });

            it("Saving personalized path", async () => {
                // Precondition: No personalized learning paths
                let history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);

                // Act
                const result = await pathFinderService.enrollment(
                    learner.id,
                    pathDefinition.id,
                    true,
                );

                // Assert: All 3 units are part of path; Path was saved
                const expected: EnrollmentResponseDto = {
                    learningPathId: pathDefinition.id,
                    personalizedPathId: expect.any(String),
                    learningUnits: [
                        { unitId: unit1.id, status: STATUS.OPEN },
                        { unitId: unit2.id, status: STATUS.OPEN },
                        { unitId: unit3.id, status: STATUS.OPEN },
                    ],
                };
                expect(result).toMatchObject(expected);
                history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(1);
            });
        });

        describe("With background knowledge", () => {
            it("Inspect (without saving path)", async () => {
                // Precondition: No personalized learning paths; but some skills learned
                let history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);
                await historyService.addLearnedSkillToUser(learner.id, skill1.id);
                await historyService.addLearnedSkillToUser(learner.id, skill2.id);

                // Act
                const result = await pathFinderService.enrollment(
                    learner.id,
                    pathDefinition.id,
                    false,
                );

                // Assert: Only last is part of path; Path not saved
                const expected: EnrollmentPreviewResponseDto = {
                    learningPathId: pathDefinition.id,
                    learningUnits: [unit3.id],
                };
                expect(result).toMatchObject(expected);
                history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);
            });

            it("Saving personalized path", async () => {
                // Precondition: No personalized learning paths; but some skills learned
                let history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(0);
                await historyService.addLearnedSkillToUser(learner.id, skill1.id);
                await historyService.addLearnedSkillToUser(learner.id, skill2.id);

                // Act
                const result = await pathFinderService.enrollment(
                    learner.id,
                    pathDefinition.id,
                    true,
                );

                // Assert: Only last is part of path; Path was saved
                const expected: EnrollmentResponseDto = {
                    learningPathId: pathDefinition.id,
                    personalizedPathId: expect.any(String),
                    learningUnits: [{ unitId: unit3.id, status: STATUS.OPEN }],
                };
                expect(result).toMatchObject(expected);
                history = await db.personalizedLearningPath.findMany({
                    where: { learningHistoryId: learner.id },
                });
                expect(history).toHaveLength(1);
            });
        });
    });
});
