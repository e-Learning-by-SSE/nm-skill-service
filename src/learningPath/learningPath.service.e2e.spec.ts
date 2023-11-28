import { ConflictException, INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../DbTestUtils";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { validate } from "class-validator";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { LearningPathModule } from "./learningPath.module";
import {
    CreateEmptyPathRequestDto,
    ErrorSynopsisDto,
    ErrorType,
    LearningPathDto,
    LearningPathListDto,
    UpdatePathRequestDto,
} from "./dto";
import { LIFECYCLE, Skill, SkillMap, LearningUnit as PrismaLearningUnit } from "@prisma/client";
import { LearningPathMgmtService } from "./learningPath.service";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";

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
                pathGoals: [],
                recommendedUnitSequence: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
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
                pathGoals: [],
                recommendedUnitSequence: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
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
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
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
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                    {
                        id: path2.id,
                        owner: "test-orga",
                        title: "",
                        lifecycle: LIFECYCLE.DRAFT,
                        requirements: [],
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
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

    describe("PATCH:/pathId", () => {
        // Test data
        let skillMap: SkillMap;
        let skill1: Skill;
        let skill2: Skill;
        let unit1: PrismaLearningUnit;
        let unit2: PrismaLearningUnit;

        beforeEach(async () => {
            await dbUtils.wipeDb();
            skillMap = await dbUtils.createSkillMap("New Owner", "Skill Map");
            skill1 = await dbUtils.createSkill(skillMap, "Skill1");
            skill2 = await dbUtils.createSkill(skillMap, "Skill2");
            unit1 = await dbUtils.createLearningUnit("Unit1", [skill1], []);
            unit2 = await dbUtils.createLearningUnit("Unit2", [skill2], [skill1]);
        });

        it("Update non-existent path -> 404", async () => {
            await dbUtils.createLearningPath("test-orga");

            // Update path
            const update: UpdatePathRequestDto = {
                owner: "New Owner",
            };

            return request(app.getHttpServer())
                .patch("/learning-paths/any-non-existent-ID")
                .send(update)
                .expect(404);
        });

        it("Fully update empty path -> 200", async () => {
            // Test object
            const initialPath = await dbUtils.createLearningPath("test-orga");

            // Input
            const update: UpdatePathRequestDto = {
                owner: "New Owner",
                title: "A new title",
                targetAudience: "A new target audience",
                description: "A new description",
                lifecycle: LIFECYCLE.POOL,
                requirements: [skill1.id],
                pathGoals: [skill2.id],
                recommendedUnitSequence: [unit1.id, unit2.id],
            };

            // Expected Result
            const expectedResult: LearningPathDto = {
                id: initialPath.id,
                owner: update.owner!,
                title: update.title!,
                targetAudience: update.targetAudience!,
                lifecycle: update.lifecycle!,
                requirements: update.requirements!,
                pathGoals: update.pathGoals!,
                recommendedUnitSequence: update.recommendedUnitSequence!,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Update initialPath
            return request(app.getHttpServer())
                .patch(`/learning-paths/${initialPath.id}`)
                .send(update)
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });

        describe("Partial Update", () => {
            it("Update title -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");

                // Input
                const update: UpdatePathRequestDto = {
                    title: "A new title",
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    title: update.title!,
                    lifecycle: initialPath.lifecycle,
                    requirements: [],
                    pathGoals: [],
                    recommendedUnitSequence: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            it("Update targetAudience -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");

                // Input
                const update: UpdatePathRequestDto = {
                    targetAudience: "A new target audience",
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    targetAudience: update.targetAudience!,
                    title: initialPath.title ?? "",
                    lifecycle: initialPath.lifecycle,
                    requirements: [],
                    pathGoals: [],
                    recommendedUnitSequence: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            it("Update requirements -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");

                // Input
                const update: UpdatePathRequestDto = {
                    requirements: [skill1.id],
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    title: initialPath.title ?? "",
                    lifecycle: initialPath.lifecycle,
                    requirements: update.requirements!,
                    pathGoals: [],
                    recommendedUnitSequence: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            it("Update goals -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");

                // Input
                const update: UpdatePathRequestDto = {
                    pathGoals: [skill2.id],
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    title: initialPath.title ?? "",
                    lifecycle: initialPath.lifecycle,
                    requirements: [],
                    pathGoals: update.pathGoals!,
                    recommendedUnitSequence: [],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            it("Update recommendedUnitSequence -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");

                // Input
                const update: UpdatePathRequestDto = {
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    title: initialPath.title ?? "",
                    lifecycle: initialPath.lifecycle,
                    requirements: [],
                    pathGoals: [],
                    recommendedUnitSequence: update.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });

            describe("Sanity Checks", () => {
                it("Cycle Detection", async () => {
                    // Test object
                    const initialPath = await dbUtils.createLearningPath("test-orga");

                    // Input
                    const update: UpdatePathRequestDto = {
                        recommendedUnitSequence: [unit2.id, unit1.id],
                    };

                    // Test: Update of initialPath -> Should contain a circle
                    return request(app.getHttpServer())
                        .patch(`/learning-paths/${initialPath.id}`)
                        .send(update)
                        .expect(409)
                        .expect((res) => {
                            const exc = res.body as ConflictException;

                            // Message of ConflictException
                            const errorMsg = (exc as unknown as { error: string }).error;
                            expect(errorMsg).toContain("1 cycles detected");

                            // Synopsis of the conflict
                            expect(exc.message.length).toBe(1);
                            const errorDesc = exc.message[0] as unknown as ErrorSynopsisDto;

                            expect(errorDesc.type).toEqual(ErrorType.CYCLE_DETECTED);
                            expect(errorDesc.affectedSkills.sort()).toEqual(
                                [skill1.id, skill2.id].sort(),
                            );
                            expect(errorDesc.affectedLearningUnits.sort()).toEqual(
                                [unit1.id, unit2.id].sort(),
                            );
                        });
                });

                it("Path Existence Check", async () => {
                    // Test object
                    const initialPath = await dbUtils.createLearningPath("test-orga");
                    const skill3 = await dbUtils.createSkill(skillMap, "Skill3");

                    // Input
                    const update: UpdatePathRequestDto = {
                        pathGoals: [skill3.id],
                    };

                    // Test: Update of initialPath -> Should contain a circle
                    return request(app.getHttpServer())
                        .patch(`/learning-paths/${initialPath.id}`)
                        .send(update)
                        .expect(409)
                        .expect((res) => {
                            const exc = res.body as ConflictException;

                            // Message of ConflictException
                            const errorMsg = (exc as unknown as { error: string }).error;
                            expect(errorMsg).toContain(
                                `Cannot compute a path from ∅ to ${skill3.id}`,
                            );

                            // Synopsis of the conflict
                            expect(exc.message.length).toBe(1);
                            const errorDesc = exc.message[0] as unknown as ErrorSynopsisDto;

                            expect(errorDesc.type).toEqual(ErrorType.PATH_NOT_FOUND);
                            expect(errorDesc.affectedSkills).toEqual([skill3.id]);
                            expect(errorDesc.affectedLearningUnits).toEqual([]);
                        });
                });
            });
        });

        describe("Update Validation Checks", () => {
            it("External requirements; Provides Goal; recommended order of 1 -> 200", async () => {
                // Test object
                const initialPath = await dbUtils.createLearningPath("test-orga");
                const unit = await dbUtils.createLearningUnit("Unit1", [skill1], [skill2]);

                // Input
                const update: UpdatePathRequestDto = {
                    title: "A new title",
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit.id],
                };

                // Expected Result
                const expectedResult: LearningPathDto = {
                    id: initialPath.id,
                    owner: initialPath.owner,
                    title: update.title!,
                    lifecycle: initialPath.lifecycle,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit.id],
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                // Test: Update of initialPath
                return request(app.getHttpServer())
                    .patch(`/learning-paths/${initialPath.id}`)
                    .send(update)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as LearningPathDto;
                        expect(result).toMatchObject(expectedResult);
                    });
            });
        });
    });

    describe("GET:/pathId", () => {
        it("Request non-existent path -> 404", async () => {
            await dbUtils.createLearningPath("test-orga");

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get("/learning-paths/any-non-existent-ID")
                .expect(404);
        });

        it("Request empty path -> 200", async () => {
            const createdPath = await dbUtils.createLearningPath("test-orga");

            // Expected Result
            const expectedResult: LearningPathDto = {
                id: createdPath.id,
                owner: createdPath.owner,
                title: createdPath.title ?? "",
                lifecycle: LIFECYCLE.DRAFT,
                requirements: [],
                pathGoals: [],
                recommendedUnitSequence: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get(`/learning-paths/${createdPath.id}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });

        it("Request fully configured path -> 200", async () => {
            const createdPath = await dbUtils.createLearningPath("test-orga");
            const skillMap = await dbUtils.createSkillMap("New Owner", "Skill Map");
            const skill1 = await dbUtils.createSkill(skillMap, "Skill1");
            const skill2 = await dbUtils.createSkill(skillMap, "Skill2");
            const unit1 = await dbUtils.createLearningUnit("Unit1", [skill1], []);
            const unit2 = await dbUtils.createLearningUnit("Unit2", [skill2], [skill1]);

            // Update path
            const update: UpdatePathRequestDto = {
                owner: "New Owner",
                title: "A new title",
                targetAudience: "A new target audience",
                description: "A new description",
                lifecycle: LIFECYCLE.POOL,
                requirements: [skill1.id],
                pathGoals: [skill2.id],
                recommendedUnitSequence: [unit1.id, unit2.id],
            };
            const lpService = new LearningPathMgmtService(
                dbUtils.getDb(),
                new LearningUnitFactory(dbUtils.getDb()),
            );
            await lpService.updateLearningPath(createdPath.id, update);

            // Expected Result
            const expectedResult: LearningPathDto = {
                id: createdPath.id,
                owner: update.owner!,
                title: update.title!,
                lifecycle: update.lifecycle!,
                requirements: update.requirements!,
                pathGoals: update.pathGoals!,
                recommendedUnitSequence: update.recommendedUnitSequence!,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Create one empty path
            return request(app.getHttpServer())
                .get(`/learning-paths/${createdPath.id}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as LearningPathDto;
                    expect(result).toMatchObject(expectedResult);
                });
        });
    });

    describe("DELETE:/pathId", () => {
        beforeEach(async () => {
            await dbUtils.wipeDb();
        });

        it("Delete DRAFT -> 200", async () => {
            const createdPath = await dbUtils.createLearningPath("test-orga");

            // Test: Delete drafted path
            return request(app.getHttpServer())
                .delete(`/learning-paths/${createdPath.id}`)
                .expect(200);
        });

        it("Delete POOLED -> 403", async () => {
            const createdPath = await dbUtils.createLearningPath("test-orga");

            // Update path
            const update: UpdatePathRequestDto = {
                lifecycle: LIFECYCLE.POOL,
            };
            const lpService = new LearningPathMgmtService(
                dbUtils.getDb(),
                new LearningUnitFactory(dbUtils.getDb()),
            );
            await lpService.updateLearningPath(createdPath.id, update);

            // Test: Delete pooled path
            return request(app.getHttpServer())
                .delete(`/learning-paths/${createdPath.id}`)
                .expect(403);
        });

        it("Delete ARCHIVED -> 403", async () => {
            const createdPath = await dbUtils.createLearningPath("test-orga");

            // Update path
            const update: UpdatePathRequestDto = {
                lifecycle: LIFECYCLE.ARCHIVED,
            };
            const lpService = new LearningPathMgmtService(
                dbUtils.getDb(),
                new LearningUnitFactory(dbUtils.getDb()),
            );
            await lpService.updateLearningPath(createdPath.id, update);

            // Test: Delete archived path
            return request(app.getHttpServer())
                .delete(`/learning-paths/${createdPath.id}`)
                .expect(403);
        });
    });
});
