import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../DbTestUtils";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { validate } from "class-validator";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { LearningPathModule } from "./learningPath.module";
import { CreateEmptyPathRequestDto, LearningPathDto, LearningPathListDto } from "./dto";
import { LIFECYCLE } from "@prisma/client";
describe("Learning-Path Controller E2E-Tests", () => {
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
                LearningPathModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("POST:/", () => {
        it("Create empty Learning-Path on empty DB -> success (201)", async () => {
            // Test Input
            const input: CreateEmptyPathRequestDto = {
                owner: "acme-inc",
            };

            // Expected Result
            const expectedResult: LearningPathDto = {
                id: expect.any(String),
                owner: input.owner,
                title: "",
                lifecycle: LIFECYCLE.DRAFT,
                requirements: [],
                goals: [],
                recommendedUnitSequence: [],
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .post("/learning-paths")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });

        it("Create multiple empty Learning-Paths on empty DB -> success (201)", async () => {
            // Test Input
            const input: CreateEmptyPathRequestDto = {
                owner: "acme-inc",
            };

            // Expected Result
            const expectedResult: LearningPathDto = {
                id: expect.any(String),
                owner: input.owner,
                title: "",
                lifecycle: LIFECYCLE.DRAFT,
                requirements: [],
                goals: [],
                recommendedUnitSequence: [],
            };

            // Test: Create 2 paths; second path should have different ID
            // Await first result to compare it with second result
            let firstResult: LearningPathDto;
            await request(app.getHttpServer())
                .post("/learning-paths")
                .send(input)
                .expect(201)
                .expect((res) => {
                    firstResult = res.body as LearningPathDto;
                    expect(firstResult).toMatchObject(expectedResult);
                });
            // Second request: Check if a different path was created (different ID)
            return request(app.getHttpServer())
                .post("/learning-paths")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    console.log(`First: ${JSON.stringify(firstResult)}`);
                    console.log(`Result: ${JSON.stringify(result)}`);
                    expect(result).toMatchObject(expectedResult);
                    expect(result.id).not.toEqual(firstResult.id);
                });
        });
    });

    describe("GET:?owner", () => {
        it("Request Learning-Paths of non-existent user", async () => {
            await dbUtils.createLearningPath("test-orga");

            // Expected Result
            const expectedResult: LearningPathListDto = {
                learningPaths: [],
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get("/learning-paths?owner=unknown-orga")
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });

        it("Request Learning-Paths of user with 1 path", async () => {
            await dbUtils.createLearningPath("test-orga");

            // Expected Result
            const expectedResult: LearningPathListDto = {
                learningPaths: [
                    {
                        id: expect.any(String),
                        owner: "test-orga",
                        title: "",
                        lifecycle: LIFECYCLE.DRAFT,
                        requirements: [],
                        goals: [],
                        recommendedUnitSequence: [],
                    },
                ],
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get("/learning-paths?owner=test-orga")
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });

        it("Request Learning-Paths of user with multiple paths", async () => {
            const path1 = await dbUtils.createLearningPath("test-orga");
            const path2 = await dbUtils.createLearningPath("test-orga");

            // Expected Result
            const expectedResult: LearningPathListDto = {
                learningPaths: expect.arrayContaining([
                    {
                        id: path1.id,
                        owner: "test-orga",
                        title: "",
                        lifecycle: LIFECYCLE.DRAFT,
                        requirements: [],
                        goals: [],
                        recommendedUnitSequence: [],
                    },
                    {
                        id: path2.id,
                        owner: "test-orga",
                        title: "",
                        lifecycle: LIFECYCLE.DRAFT,
                        requirements: [],
                        goals: [],
                        recommendedUnitSequence: [],
                    },
                ]),
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get("/learning-paths?owner=test-orga")
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });
    });
});
