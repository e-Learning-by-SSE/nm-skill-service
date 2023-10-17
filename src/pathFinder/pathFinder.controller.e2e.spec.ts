import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { SkillMap, Skill, LearningUnit } from "@prisma/client";
import { validate } from "class-validator";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaModule } from "../prisma/prisma.module";
import { PathDto, PathRequestDto } from "./dto";
import { PathFinderModule } from "./pathFinder.module";

describe("PathFinder Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();

    /**
     * Initializes (relevant parts of) the application before the first test.
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validate,
                    validationOptions: { allowUnknown: false },
                }),
                PrismaModule,
                PathFinderModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });
    describe("POST:computePath", () => {
        /**
         * Tests for the computePath() method with and without the presence of a LearningProgressProfile (as part of the UserProfile).
         */
        describe("Generic/Individual Paths", () => {
            // Test data
            let skillMap1: SkillMap;
            let skill1: Skill,
                skill2: Skill,
                skill3: Skill,
                nestedSkill1: Skill,
                nestedSkill2: Skill;

            let lu1: LearningUnit, lu2: LearningUnit, lu3: LearningUnit, lu4: LearningUnit;

            beforeEach(async () => {
                // Wipe DB before test
                await dbUtils.wipeDb();

                skillMap1 = await dbUtils.createSkillMap(
                    "User 1",
                    "Test Map for LearningUnit Controller Tests",
                );
                skill1 = await dbUtils.createSkill(skillMap1, "Skill 1");
                nestedSkill1 = await dbUtils.createSkill(skillMap1, "Nested Skill 1", [skill1.id]);
                nestedSkill2 = await dbUtils.createSkill(skillMap1, "Nested Skill 2", [skill1.id]);
                skill2 = await dbUtils.createSkill(skillMap1, "Skill 2");
                skill3 = await dbUtils.createSkill(skillMap1, "Skill 3");

                lu1 = await dbUtils.createLearningUnit("Learning Unit 1", [nestedSkill1], []);
                lu2 = await dbUtils.createLearningUnit("Learning Unit 2", [nestedSkill2], []);
                lu3 = await dbUtils.createLearningUnit("Learning Unit 3", [skill2], [skill1]);
                lu4 = await dbUtils.createLearningUnit("Learning Unit 3", [skill3], [skill2]);
            });

            it("Compute Path wo/ knowledge", async () => {
                // Expected result
                // [lu2.id, lu1.id, lu3.id, lu4.id] is a valid result, too
                const expectedResult: PathDto = {
                    learningUnits: expect.arrayContaining([lu1.id, lu2.id, lu3.id, lu4.id]),
                    cost: 4.6,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                };

                // Test: Create a path to learn Skill 3, without prior knowledge
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        const result = res.body as PathDto;
                        if (
                            result.learningUnits[0] === lu2.id &&
                            result.learningUnits[1] === lu1.id
                        ) {
                            // Swap LU1 and LU2 (Both combinations are valid)
                            const reorderedUnits = [...result.learningUnits];
                            reorderedUnits[0] = result.learningUnits[1];
                            reorderedUnits[1] = result.learningUnits[0];
                            result.learningUnits = reorderedUnits;
                        }
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            it("Compute Path w/ child knowledge", async () => {
                // Create UserProfile with knowledge of nested Skill
                const userId = "User 1";
                await dbUtils.createLearningProgress(userId, [nestedSkill2.id]);

                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu1.id, lu3.id, lu4.id],
                    cost: 3.4,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: userId,
                };

                // Test: Create a path to learn Skill 3, with knowledge NestedSkill 2
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body as PathDto).toMatchObject(expectedResult);
                    });
            });

            it("Compute Path w/ parent knowledge", async () => {
                // Create UserProfile with knowledge of non-nested Skill
                const userId = "User 1";
                await dbUtils.createLearningProgress(userId, [skill1.id]);

                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu3.id, lu4.id],
                    cost: 2.2,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: userId,
                };

                // Test: Create a path to learn Skill 3, with knowledge Skill 1
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body as PathDto).toMatchObject(expectedResult);
                    });
            });

            it("Compute Path w/ empty LearningProgress", async () => {
                // Create UserProfile with empty LearningProgress
                const userId = "User 1";
                await dbUtils.createLearningProgress(userId, []);

                // Expected result
                // [lu2.id, lu1.id, lu3.id, lu4.id] is a valid result, too
                const expectedResult: PathDto = {
                    learningUnits: [lu1.id, lu2.id, lu3.id, lu4.id],
                    cost: 4.6,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                };

                // Test: Create a path to learn Skill 3, without prior knowledge
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        const result = res.body as PathDto;
                        if (
                            result.learningUnits[0] === lu2.id &&
                            result.learningUnits[1] === lu1.id
                        ) {
                            // Swap LU1 and LU2 (Both combinations are valid)
                            const reorderedUnits = [...result.learningUnits];
                            reorderedUnits[0] = result.learningUnits[1];
                            reorderedUnits[1] = result.learningUnits[0];
                            result.learningUnits = reorderedUnits;
                        }
                        expect(result).toMatchObject(expectedResult);
                    });
            });
        });

        /**
         * Tests the selection of the Greedy/Optimal approach.
         */
        describe("Optimal/Greedy Approach", () => {
            // Test data
            let skillMap1: SkillMap;
            let skill1: Skill, skill2: Skill, skill3: Skill, skill4: Skill;

            let lu1: LearningUnit, lu2: LearningUnit, lu3: LearningUnit, lu4: LearningUnit;

            beforeEach(async () => {
                // Wipe DB before test
                await dbUtils.wipeDb();

                skillMap1 = await dbUtils.createSkillMap(
                    "User 1",
                    "Test Map for LearningUnit Controller Tests",
                );
                skill1 = await dbUtils.createSkill(skillMap1, "Skill 1");
                skill2 = await dbUtils.createSkill(skillMap1, "Skill 2");
                skill3 = await dbUtils.createSkill(skillMap1, "Skill 3");
                skill4 = await dbUtils.createSkill(skillMap1, "Skill 4");

                /**
                 * Skill 2 is provided by LU1 and LU3, thus, learning Skill 2 & 4 can be done by two different paths:
                 * Optimal: LU2 -> LU3 -> LU4
                 * Greedy:
                 *   - Skill 2: LU1
                 *   - Skill 4: LU2 -> LU3 -> LU4
                 *   -> LU1 -> LU2 -> LU3 -> LU4
                 */
                lu1 = await dbUtils.createLearningUnit("Learning Unit 1", [skill2], []);
                lu2 = await dbUtils.createLearningUnit("Learning Unit 2", [skill1], []);
                lu3 = await dbUtils.createLearningUnit(
                    "Learning Unit 3",
                    [skill2, skill3],
                    [skill1],
                );
                lu4 = await dbUtils.createLearningUnit("Learning Unit 3", [skill4], [skill3]);
            });

            it("Compute Path (Optimal)", async () => {
                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                    cost: 3.4,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill2.id, skill4.id],
                    optimalSolution: true,
                };

                // Test: Create a path to learn Skill 3, without prior knowledge
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body as PathDto).toMatchObject(expectedResult);
                    });
            });

            it("Compute Path (Greedy)", async () => {
                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu1.id, lu2.id, lu3.id, lu4.id],
                    cost: 4.4,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill2.id, skill4.id],
                    optimalSolution: false,
                };

                // Test: Create a path to learn Skill 3, without prior knowledge
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body as PathDto).toMatchObject(expectedResult);
                    });
            });
        });
    });
});
