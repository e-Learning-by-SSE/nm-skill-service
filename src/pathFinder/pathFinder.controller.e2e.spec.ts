import {
    ConflictException,
    ForbiddenException,
    INestApplication,
    NotFoundException,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { SkillMap, Skill, LearningUnit, UserProfile, LearningPath } from "@prisma/client";
import { validate } from "class-validator";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaModule } from "../prisma/prisma.module";
import {
    CustomCoursePreviewResponseDto,
    CustomCourseRequestDto,
    EnrollmentPreviewResponseDto,
    EnrollmentRequestDto,
    PathDto,
    PathRequestDto,
    SkillsToAnalyze,
    SubPathListDto,
} from "./dto";
import { PathFinderModule } from "./pathFinder.module";
import { PrismaService } from "../prisma/prisma.service";
import { UserMgmtService } from "../user/user.service";
import { LearningHistoryService } from "../user/learningHistoryService/learningHistory.service";
import { UserModule } from "../user/user.module";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { PersonalizedPathDto } from "../user/learningHistoryService/dto";

describe("PathFinder Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();
    const config = new ConfigService();
    const db = new PrismaService(config);
    const userService = new UserMgmtService(db);
    const learningUnitFactoryService = new LearningUnitFactory(db);
    const historyService = new LearningHistoryService(db, learningUnitFactoryService);

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
                UserModule,
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

    afterAll(async () => {
        // Wipe DB after tests are finished
        await dbUtils.wipeDb();
        await db.$disconnect();
    });

    describe("adapted-path", () => {
        // Test data
        let skillMap1: SkillMap;
        let [skill1, skill2, skill3, skill4]: Skill[] = [];
        let [lu2, lu3, lu4]: LearningUnit[] = [];
        let [user1, user2]: UserProfile[] = [];
        let pathDefinition: LearningPath;

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            user1 = await dbUtils.createUserProfile("User 1");
            user2 = await dbUtils.createUserProfile("User 2");

            skillMap1 = await dbUtils.createSkillMap(
                "Instructor 1",
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
            await dbUtils.createLearningUnit([skill2], []);
            lu2 = await dbUtils.createLearningUnit([skill1], []);
            lu3 = await dbUtils.createLearningUnit([skill2, skill3], [skill1]);
            lu4 = await dbUtils.createLearningUnit([skill4], [skill3]);

            pathDefinition = await dbUtils.createLearningPath(skillMap1.ownerId, [skill4]);
        });

        describe("GET:/PathFinder/adapted-path", () => {
            it("1 user enroll (preview) to path -> 200", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: EnrollmentPreviewResponseDto = {
                    learningPathId: pathDefinition.id,
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(200);
                const enrolledPath = response.body as EnrollmentPreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Multiple users enroll (preview) to same path -> 200", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: EnrollmentPreviewResponseDto = {
                    learningPathId: pathDefinition.id,
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act 1: Enroll first user -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                let enrolledPath = response.body as EnrollmentPreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second user -> success
                enrollmentRequest.userId = user2.id;
                response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);
                // Check response -> Should be identical
                expect(response.status).toEqual(200);
                enrolledPath = response.body as EnrollmentPreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("User enrolls to course twice (preview) -> 200 (success)", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: EnrollmentPreviewResponseDto = {
                    learningPathId: pathDefinition.id,
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act 1: Enroll first time -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                let enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second time -> success
                response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Invalid user enroll to path -> 404", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: "Invalid::ID",
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                // Act: Enroll user -> fail
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/adapted-path")
                    .query(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(404);
                const exc = response.body as NotFoundException;
                expect(exc.message).toContain(
                    `Specified user not found: ${enrollmentRequest.userId}`,
                );
            });
        });

        describe("POST:/PathFinder/adapted-path", () => {
            it("1 user enroll to path -> 201", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: pathDefinition.id,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(201);
                const enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Multiple users enroll to same path -> 201", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: pathDefinition.id,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [],
                };

                // Act 1: Enroll first user -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(201);
                let enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second user -> success
                enrollmentRequest.userId = user2.id;
                response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);
                // Check response -> Should be identical
                expect(response.status).toEqual(201);
                enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("User enrolls to course twice -> 409 (fail)", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: user1.id,
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: pathDefinition.id,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [],
                };

                // Act 1: Enroll first time -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(201);
                let enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second time -> fail
                response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(409);
                const exc = response.body as ForbiddenException;
                expect(exc.message).toContain(
                    `User ${user1.id} is already enrolled in the specified path: ${enrolledPath.learningPathId}`,
                );
            });

            it("Invalid user enroll to path -> 404", async () => {
                // Input
                const enrollmentRequest: EnrollmentRequestDto = {
                    userId: "Invalid::ID",
                    learningPathId: pathDefinition.id,
                    optimalSolution: true,
                };

                // Act: Enroll user -> fail
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/adapted-path")
                    .send(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(404);
                const exc = response.body as NotFoundException;
                expect(exc.message).toContain(
                    `Specified user not found: ${enrollmentRequest.userId}`,
                );
            });
        });
    });

    describe("calculated-path", () => {
        // Test data (like in adapted-path, but without path definition)
        let skillMap1: SkillMap;
        let [skill1, skill2, skill3, skill4]: Skill[] = [];
        let [lu2, lu3, lu4]: LearningUnit[] = [];
        let [user1, user2]: UserProfile[] = [];

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            user1 = await dbUtils.createUserProfile("User 1");
            user2 = await dbUtils.createUserProfile("User 2");

            skillMap1 = await dbUtils.createSkillMap(
                "Instructor 1",
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
            await dbUtils.createLearningUnit([skill2], []);
            lu2 = await dbUtils.createLearningUnit([skill1], []);
            lu3 = await dbUtils.createLearningUnit([skill2, skill3], [skill1]);
            lu4 = await dbUtils.createLearningUnit([skill4], [skill3]);
        });

        describe("GET:/PathFinder/calculated-path", () => {
            it("1 user enrolls (preview) to goal -> 200", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: CustomCoursePreviewResponseDto = {
                    goal: [skill4.id],
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(200);
                const enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("1 user enrolls (preview) to goal (as string) -> 200", async () => {
                // Input
                const enrollmentRequest = {
                    userId: user1.id,
                    goals: skill4.id,
                    optimalSolution: true,
                };

                const expectedResponse: CustomCoursePreviewResponseDto = {
                    goal: [skill4.id],
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(200);
                const enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Multiple users enroll (preview) to same goal -> 200", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: CustomCoursePreviewResponseDto = {
                    goal: [skill4.id],
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act 1: Enroll first user -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                let enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second user -> success
                enrollmentRequest.userId = user2.id;
                response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);
                // Check response -> Should be identical
                expect(response.status).toEqual(200);
                enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("User enrolls to goal twice (preview) -> 200 (success)", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: CustomCoursePreviewResponseDto = {
                    goal: [skill4.id],
                    learningUnits: [lu2.id, lu3.id, lu4.id],
                };

                // Act 1: Enroll first time -> success
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                let enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second time -> success
                response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(200);
                enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Invalid user enroll to goal -> 404", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: "Invalid::ID",
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                // Act: Enroll user -> fail
                let response = await request(app.getHttpServer())
                    .get("/PathFinder/calculated-path")
                    .query(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(404);
                const exc = response.body as NotFoundException;
                expect(exc.message).toContain(
                    `Specified user not found: ${enrollmentRequest.userId}`,
                );
            });
        });

        describe("POST:/PathFinder/calculated-path", () => {
            it("1 user enrolls to goal -> 201", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: null,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [skill4.id],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(201);
                const enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("1 user enrolls to goal (as string) -> 201", async () => {
                // Input
                const enrollmentRequest = {
                    userId: user1.id,
                    goals: skill4.id,
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: null,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [skill4.id],
                };

                // Act: Enroll user -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(201);
                const enrolledPath = response.body as CustomCoursePreviewResponseDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("Multiple users enroll to same goal -> 201", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: null,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [skill4.id],
                };

                // Act 1: Enroll first user -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(201);
                let enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second user -> success
                enrollmentRequest.userId = user2.id;
                response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);
                // Check response -> Should be identical
                expect(response.status).toEqual(201);
                enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);
            });

            it("User enrolls to goal twice -> 409 (fail)", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: user1.id,
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                const expectedResponse: PersonalizedPathDto = {
                    personalizedPathId: expect.any(String),
                    learningPathId: null,
                    learningUnitInstances: [
                        { unitId: lu2.id, status: "OPEN" },
                        { unitId: lu3.id, status: "OPEN" },
                        { unitId: lu4.id, status: "OPEN" },
                    ],
                    status: "OPEN",
                    goals: [skill4.id],
                };

                // Act 1: Enroll first time -> success
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(201);
                let enrolledPath = response.body as PersonalizedPathDto;
                expect(enrolledPath).toMatchObject(expectedResponse);

                // Act 2: Enroll second time -> fail
                response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);
                // Check response
                expect(response.status).toEqual(409);
                const exc = response.body as ForbiddenException;
                expect(exc.message).toContain(
                    `User ${user1.id} has already specified a personalized path with goal: ${enrolledPath.goals}`,
                );
            });

            it("Invalid user enroll to goal -> 404", async () => {
                // Input
                const enrollmentRequest: CustomCourseRequestDto = {
                    userId: "Invalid::ID",
                    goals: [skill4.id],
                    optimalSolution: true,
                };

                // Act: Enroll user -> fail
                let response = await request(app.getHttpServer())
                    .post("/PathFinder/calculated-path")
                    .send(enrollmentRequest);

                // Check response
                expect(response.status).toEqual(404);
                const exc = response.body as NotFoundException;
                expect(exc.message).toContain(
                    `Specified user not found: ${enrollmentRequest.userId}`,
                );
            });
        });
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

                lu1 = await dbUtils.createLearningUnit([nestedSkill1], []);
                lu2 = await dbUtils.createLearningUnit([nestedSkill2], []);
                lu3 = await dbUtils.createLearningUnit([skill2], [skill1]);
                lu4 = await dbUtils.createLearningUnit([skill3], [skill2]);
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
                const expectedUser = {
                    id: "testUser",
                };

                // Create the user and save it to the DB
                await userService.createUser(expectedUser);

                // Teach the user the skill
                await historyService.addLearnedSkillToUser(expectedUser.id, nestedSkill2.id);

                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu1.id, lu3.id, lu4.id],
                    cost: 3.4,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: expectedUser.id,
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
                const expectedUser = {
                    id: "testUser",
                };

                // Create the user and save it to the DB
                await userService.createUser(expectedUser);

                // Teach the user the skill
                await historyService.addLearnedSkillToUser(expectedUser.id, skill1.id);

                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: [lu3.id, lu4.id],
                    cost: 2.2,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: expectedUser.id,
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

            it("Compute Path w/ profile but wo/ knowledge", async () => {
                // Create UserProfile with knowledge of nested Skill
                const expectedUser = {
                    id: "testUser",
                };

                // Create the user and save it to the DB
                await userService.createUser(expectedUser);

                // Expected result
                const expectedResult: PathDto = {
                    learningUnits: expect.arrayContaining([lu1.id, lu2.id, lu3.id, lu4.id]),
                    cost: 4.6,
                };

                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: expectedUser.id,
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

            it("Compute Path w/ empty LearningProgress", async () => {
                // Create UserProfile with empty LearningProgress
                const expectedUser = {
                    id: "testUser",
                };

                // Create the user and save it to the DB (initially their learning history is empty)
                await userService.createUser(expectedUser);

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

            it("Compute Path w/ non-existing profile", async () => {
                // Input
                const input: PathRequestDto = {
                    goal: [skill3.id],
                    userId: "invalid-user-id",
                };

                // Test: Create a path to learn Skill 3, with knowledge NestedSkill 2
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(404)
                    .expect((res) => {
                        const result = res.body as NotFoundException;
                        expect(result.message).toContain(
                            "Specified user not found: invalid-user-id",
                        );
                    });
            });
        });

        /**
         * Tests the selection of the Greedy/Optimal approach.
         */
        describe("Optimal/Greedy Approach", () => {
            // Test data
            let skillMap1: SkillMap;
            let [skill1, skill2, skill3, skill4]: Skill[] = [];
            let [lu1, lu2, lu3, lu4]: LearningUnit[] = [];

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
                lu1 = await dbUtils.createLearningUnit([skill2], []);
                lu2 = await dbUtils.createLearningUnit([skill1], []);
                lu3 = await dbUtils.createLearningUnit([skill2, skill3], [skill1]);
                lu4 = await dbUtils.createLearningUnit([skill4], [skill3]);
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
                    cost: 4.6,
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

            it("No Path available -> 404", async () => {
                const skill5 = await dbUtils.createSkill(skillMap1, "Skill 5");
                const skill6 = await dbUtils.createSkill(skillMap1, "Skill 6");

                // LU5 (Skill 5) missing
                await dbUtils.createLearningUnit([skill6], [skill5]);

                // Input
                const input: PathRequestDto = {
                    goal: [skill6.id],
                    optimalSolution: true,
                };

                // Test: Create a path to learn Skill 3, without prior knowledge
                return request(app.getHttpServer())
                    .post("/PathFinder/computePath")
                    .send(input)
                    .expect(404)
                    .expect((res) => {
                        const exc = res.body as NotFoundException;
                        expect(exc.message).toEqual(
                            `Could not compute a path for the specified goal: ${skill6.id}`,
                        );
                    });
            });
        });
    });

    describe("POST:/skillAnalysis", () => {
        // Test data
        let skillMap1: SkillMap;
        let [skill1, skill2, skill3, skill4, skill5]: Skill[] = [];
        let [lu1, lu2, lu3, lu4]: LearningUnit[] = [];

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
            skill5 = await dbUtils.createSkill(skillMap1, "Skill 5");

            /**
             * Available paths:
             * LU1 (Skill 1) -> LU2 (Skill 2) -> * MISSING * -> LU3  (Skill 3) -> LU4  (Skill 4)
             */
            lu1 = await dbUtils.createLearningUnit([skill1], []);
            lu2 = await dbUtils.createLearningUnit([skill2], [skill1]);
            lu3 = await dbUtils.createLearningUnit([skill4], [skill3]);
            lu4 = await dbUtils.createLearningUnit([skill5], [skill4]);
        });

        it("Path exist -> 409 (analysis not required)", async () => {
            // Input
            const input: SkillsToAnalyze = {
                goal: [skill2.id],
            };

            // Test: Detect problems to learn Skill 2 (no errors)
            return request(app.getHttpServer())
                .post("/PathFinder/skillAnalysis")
                .send(input)
                .expect(409)
                .expect((res) => {
                    expect((res.body as ConflictException).message).toEqual(
                        `There is a learning path for the goal: ${skill2.id}, try to use computePath`,
                    );
                });
        });

        it("Path does not exist -> 201 (Missing Skill)", async () => {
            // Input
            const input: SkillsToAnalyze = {
                goal: [skill4.id],
            };

            // Expected result (No path to Skill 3)
            const expectedResult: SubPathListDto = {
                subPaths: [
                    {
                        skill: skill3.id,
                        learningUnits: [],
                    },
                ],
            };

            // Test: Detect problems to learn Skill 4 (skill 3 cannot be learned)
            const result = await request(app.getHttpServer())
                .post("/PathFinder/skillAnalysis")
                .send(input);
            expect(result.status).toEqual(201);
            const analysisResult = result.body as SubPathListDto;
            expect(analysisResult).toMatchObject(expectedResult);
        });
    });
});
