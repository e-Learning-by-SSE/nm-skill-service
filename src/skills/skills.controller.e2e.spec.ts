import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { SkillModule } from "./skill.module";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import {
    ResolvedSkillDto,
    ResolvedSkillListDto,
    SkillCreationDto,
    SkillDto,
    SkillListDto,
    SkillRepositoryCreationDto,
    SkillRepositoryDto,
    SkillRepositoryListDto,
    SkillRepositorySearchDto,
    SkillRepositoryUpdateDto,
    SkillSearchDto,
    SkillUpdateDto,
    UnresolvedSkillRepositoryDto,
} from "./dto";
import { Skill, SkillMap } from "@prisma/client";

type SkillWithChildren = Skill & { nestedSkills: { id: string }[] };

describe("Skill Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();

    // Test data
    let [skillMap1, skillMap2, skillMap3, skillMapWithSkills]: SkillMap[] = [];
    let [skill1, skill2, skill3, nestedSkill1]: SkillWithChildren[] = [];

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
                SkillModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();

        // Create test data
        skillMap1 = await dbUtils.createSkillMap("User-1", "Awesome Test Map");
        skillMap2 = await dbUtils.createSkillMap("User-1", "Test Map 2");
        skillMap3 = await dbUtils.createSkillMap(
            "User-2",
            "Another awesome map by a different user",
        );
        skillMapWithSkills = await dbUtils.createSkillMap("User-3", "A skill map with skills");
        skill1 = await dbUtils.createSkill(skillMap3, "Item of Map 3");
        skill2 = await dbUtils.createSkill(
            skillMapWithSkills,
            "Awesome Skill",
            [],
            "A description for skill 2",
        );
        skill3 = await dbUtils.createSkill(
            skillMapWithSkills,
            "Another Skill",
            [],
            "A description for skill 3",
        );
        nestedSkill1 = await dbUtils.createSkill(
            skillMapWithSkills,
            "Nested Skill",
            [skill2.id],
            "A description for nested skill 1",
        );
    });

    describe("GET:/getAllSkills", () => {
        it("Get all skills -> All skills returned; 200", () => {
            // Expected result
            const expectedObject: SkillListDto = {
                skills: [
                    SkillDto.createFromDao(skill1),
                    SkillDto.createFromDao({ ...skill2, nestedSkills: [nestedSkill1] }),
                    SkillDto.createFromDao(skill3),
                    SkillDto.createFromDao({ ...nestedSkill1, parentSkills: [skill2] }),
                ],
            };

            return request(app.getHttpServer())
                .get("/skill-repositories/getAllSkills")
                .expect(200)
                .expect((res) => {
                    const result = res.body as SkillListDto;
                    expect(result).toEqual(expectedObject);
                });
        });

        it("Empty DB -> 404", async () => {
            await dbUtils.wipeDb();

            return request(app.getHttpServer()).get("/skill-repositories/getAllSkills").expect(404);
        });
    });

    describe("POST:/skill-repositories", () => {
        it("Search for Skill Maps of not existing user -> Empty list", () => {
            // Search DTO
            const input: SkillRepositorySearchDto = {
                owner: "not-existing-owner-id",
            };

            // Expected result
            const emptyList: SkillRepositoryListDto = {
                repositories: [],
            };

            // Test: Search for Skill Maps of not existing user
            return request(app.getHttpServer())
                .post("/skill-repositories")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as SkillRepositoryListDto;
                    expect(result).toMatchObject(emptyList);
                });
        });

        it("All repositories of one user", () => {
            // Search DTO
            const input: SkillRepositorySearchDto = {
                owner: skillMap1.ownerId,
            };

            // Expected result
            const expectedList: SkillRepositoryListDto = {
                repositories: [
                    SkillRepositoryDto.createFromDao(skillMap1),
                    SkillRepositoryDto.createFromDao(skillMap2),
                ],
            };

            // Test: Search for Skill Maps of User-1
            return request(app.getHttpServer())
                .post("/skill-repositories")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as SkillRepositoryListDto;
                    expect(result).toEqual(expectedList);
                });
        });

        it("By contained name", () => {
            // Search DTO
            const input: SkillRepositorySearchDto = {
                name: "awesome",
            };

            // Expected result
            const expectedList: SkillRepositoryListDto = {
                repositories: [
                    SkillRepositoryDto.createFromDao(skillMap1),
                    SkillRepositoryDto.createFromDao(skillMap3),
                ],
            };

            // Test: Search for Skill Maps of User-1
            return request(app.getHttpServer())
                .post("/skill-repositories")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as SkillRepositoryListDto;
                    expect(result).toEqual(expectedList);
                });
        });
    });

    describe("/skill-repositories/:owner", () => {
        it("Skill Maps of not existing user -> Empty list", () => {
            // Expected result
            const expectedObject: SkillRepositoryListDto = {
                repositories: [],
            };
            const expected: string = JSON.stringify(expectedObject);

            return request(app.getHttpServer())
                .get("/skill-repositories/byOwner/not-existing-owner-id")
                .expect(200)
                .expect((res) => {
                    expect(JSON.stringify(res.body)).toEqual(expected);
                });
        });

        it("Skill Maps of existing user -> Skill Maps of that user", () => {
            // Expected result
            const expectedObject: SkillRepositoryListDto = {
                repositories: [
                    SkillRepositoryDto.createFromDao(skillMap1),
                    SkillRepositoryDto.createFromDao(skillMap2),
                ],
            };

            return request(app.getHttpServer())
                .get(`/skill-repositories/byOwner/${skillMap1.ownerId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining(expectedObject));
                });
        });
    });

    describe("POST:/skill-repositories/create", () => {
        it("Create Skill-Repository without conflict -> 201", () => {
            // Create DTO
            const input: SkillRepositoryCreationDto = {
                name: "New Skill Map",
                description: "This is a new skill map",
                ownerId: skillMap1.ownerId,
                version: "2.0.1",
            };

            // Expected result
            const { ownerId, ...samePart } = input;
            const expectedObject: SkillRepositoryDto = {
                ...samePart,
                owner: input.ownerId,
                id: expect.any(String),
            };

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/create`)
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining(expectedObject));
                });
        });
    });

    describe("POST:/skill-repositories/{repositoryId}/skill/add_skill", () => {
        it("New Skill; No nested; Existing repository; No conflict -> 201", () => {
            // Creation DTO
            const input: SkillCreationDto = {
                name: "New Skill",
                description: "This is a new skill",
                level: 1,
                nestedSkills: [],
                owner: skillMap1.ownerId,
            };

            // Expected result
            const expectedObject: SkillDto = {
                ...input,
                id: expect.any(String),
                nestedSkills: [],
                parentSkills: [],
                repositoryId: skillMap1.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete (expectedObject as any).owner;

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/${skillMap1.id}/skill/add_skill`)
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("New Skill; With nested; Existing repository; No conflict -> 201", () => {
            // Creation DTO
            const input: SkillCreationDto = {
                name: "New Skill",
                description: "This is a new skill",
                level: 1,
                nestedSkills: [skill2.id],
                owner: skillMap1.ownerId,
            };

            // Expected result
            const expectedObject: SkillDto = {
                ...input,
                id: expect.any(String),
                nestedSkills: [skill2.id],
                parentSkills: [],
                repositoryId: skillMap1.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete (expectedObject as any).owner;

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/${skillMap1.id}/skill/add_skill`)
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("New Skill; No nested; Non-existing repository; No conflict -> 404 (Repository not found)", () => {
            // Creation DTO
            const input: SkillCreationDto = {
                name: "New Skill",
                description: "This is a new skill",
                level: 1,
                nestedSkills: [],
                owner: skillMap1.ownerId,
            };

            // Expected result
            const expectedObject: SkillDto = {
                ...input,
                id: expect.any(String),
                parentSkills: [],
                repositoryId: skillMap1.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete (expectedObject as any).owner;

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/A-non-existing-repository/skill/add_skill`)
                .send(input)
                .expect(404);
        });

        it("New Skill; No nested; Existing repository; Wrong owner -> 403 (forbidden)", () => {
            // Creation DTO
            const input: SkillCreationDto = {
                name: "New Skill",
                description: "This is a new skill",
                level: 1,
                nestedSkills: [skill2.id],
                owner: skillMap1.ownerId,
            };

            // Expected result
            const expectedObject: SkillDto = {
                ...input,
                id: expect.any(String),
                nestedSkills: [skill2.id],
                parentSkills: [],
                repositoryId: skillMap1.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete (expectedObject as any).owner;

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/${skillMap3.id}/skill/add_skill`)
                .send(input)
                .expect(403);
        });
    });

    describe("GET:/byId", () => {
        it("Skill Map by ID", () => {
            // Expected result
            const expectedObject: UnresolvedSkillRepositoryDto = {
                ...SkillRepositoryDto.createFromDao(skillMap1),
                skills: [],
            };

            return request(app.getHttpServer())
                .get(`/skill-repositories/byId/${skillMap1.id}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as UnresolvedSkillRepositoryDto;
                    expect(result).toEqual(expectedObject);
                });
        });

        it("Skill Map by ID with Skills", () => {
            // Expected result
            const expectedObject: UnresolvedSkillRepositoryDto = {
                ...SkillRepositoryDto.createFromDao(skillMapWithSkills),
                skills: [skill2.id, skill3.id, nestedSkill1.id].sort(),
            };
            delete expectedObject.description;

            return request(app.getHttpServer())
                .get(`/skill-repositories/byId/${skillMapWithSkills.id}`)
                .expect(200)
                .expect((res) => {
                    res.body.skills.sort();
                    expect(res.body as UnresolvedSkillRepositoryDto).toMatchObject(expectedObject);
                });
        });

        it("Non-existing ID -> 404", () => {
            return request(app.getHttpServer())
                .get("/skill-repositories/byId/not-existing-id")
                .expect(404)
                .expect((res) => {
                    const exc = res.body as NotFoundException;
                    expect(exc.message).toBe("Specified repository not found: not-existing-id");
                });
        });
    });

    describe("POST:/findSkills", () => {
        it("Search for Skills of not existing Skill Map -> Empty list", () => {
            // Search DTO
            const input: SkillSearchDto = {
                skillMap: "not-existing-map-id",
            };

            // Expected result
            const emptyList: SkillListDto = {
                skills: [],
            };

            // Test: Search for Skills
            return request(app.getHttpServer())
                .post("/skill-repositories/findSkills")
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining(emptyList));
                });
        });

        it("Search for Skills by Name", () => {
            // Search DTO
            const input: SkillSearchDto = {
                name: "Skill",
            };

            // Expected result: All skills with name '*Skill*'
            const resultList: SkillListDto = {
                skills: [
                    {
                        ...SkillDto.createFromDao(skill2),
                        nestedSkills: [nestedSkill1.id],
                    },
                    SkillDto.createFromDao(skill3),
                    SkillDto.createFromDao(nestedSkill1),
                ],
            };

            // Test: Search for Skills
            return request(app.getHttpServer())
                .post("/skill-repositories/findSkills")
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining(resultList));
                });
        });

        it("Pagination", () => {
            // Search DTO
            const input: SkillSearchDto = {
                page: 0,
                pageSize: 2,
            };

            // Test: Search for Skills (only 2 of 4 Skills should be returned)
            return request(app.getHttpServer())
                .post("/skill-repositories/findSkills")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as SkillListDto;
                    expect(result.skills.length).toBe(2);
                });
        });

        it("Incomplete Pagination -> Fix", async () => {
            await dbUtils.wipeDb();
            // Create more skills than default page size
            const skillMap = await dbUtils.createSkillMap("User-1", "Test Map of Anonymous Skills");

            const defaultPageSize = 10;
            await Promise.all(
                Array.from(Array(defaultPageSize + 1).keys()).map((i) =>
                    dbUtils.createSkill(skillMap, `Anonymous Skill ${i}`),
                ),
            );

            // Search DTO (missing pagesize, should be set to default)
            const input: SkillSearchDto = {
                page: 1,
            };

            // Test: Search for Skills (only 2 of 4 Skills should be returned)
            return request(app.getHttpServer())
                .post("/skill-repositories/findSkills")
                .send(input)
                .expect(201)
                .expect((res) => {
                    const result = res.body as SkillListDto;
                    expect(result.skills.length).toBe(1);
                });
        });

        it("Search for Skills by non-existent name -> 404", () => {
            // Search DTO
            const input: SkillSearchDto = {
                name: "UnusedName",
            };

            // Expected result
            const emptyList: SkillListDto = {
                skills: [],
            };

            // Test: Search for Skills
            return request(app.getHttpServer())
                .post("/skill-repositories/findSkills")
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expect.objectContaining(emptyList));
                });
        });
    });

    describe("/resolve", () => {
        describe("/findSkills", () => {
            it("Search for Skills by Name", () => {
                // Search DTO
                const input: SkillSearchDto = {
                    name: "Skill",
                };

                // Expected result: All skills with name '*Skill*'
                const resultList: ResolvedSkillListDto = {
                    skills: [
                        {
                            ...ResolvedSkillDto.createFromDao(skill2),
                            nestedSkills: [ResolvedSkillDto.createFromDao(nestedSkill1)],
                        },
                        ResolvedSkillDto.createFromDao(skill3),
                        ResolvedSkillDto.createFromDao(nestedSkill1),
                    ],
                };

                // Test: Search for Skills
                return request(app.getHttpServer())
                    .post("/skill-repositories/resolve/findSkills")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).toMatchObject(expect.objectContaining(resultList));
                    });
            });

            it("Search for Skills (Pagination)", () => {
                // Search DTO (omits the first 2 skills and shows the next 2)
                const input: SkillSearchDto = {
                    page: 1,
                    pageSize: 2,
                };

                // Expected result: All skills with name '*Skill*'
                const resultList: ResolvedSkillListDto = {
                    skills: [
                        {
                            ...ResolvedSkillDto.createFromDao(skill3),
                        },
                        ResolvedSkillDto.createFromDao(nestedSkill1),
                    ],
                };

                // Test: Search for Skills
                return request(app.getHttpServer())
                    .post("/skill-repositories/resolve/findSkills")
                    .send(input)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).toMatchObject(expect.objectContaining(resultList));
                    });
            });
        });

        describe("skill/:skillId", () => {
            it("Not existing ID -> NotFoundException", () => {
                return request(app.getHttpServer())
                    .get(`/skill-repositories/resolve/skill/not-existing-id`)
                    .expect(404)
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            expect.objectContaining({
                                error: "Not Found",
                                message: "Specified skill not found: not-existing-id",
                            }),
                        );
                    });
            });

            it("Existing ID -> Skill", () => {
                // Expected result
                const expectedObject: ResolvedSkillDto = {
                    ...ResolvedSkillDto.createFromDao(skill2),
                    nestedSkills: [ResolvedSkillDto.createFromDao(nestedSkill1)],
                };

                return request(app.getHttpServer())
                    .get(`/skill-repositories/resolve/skill/${skill2.id}`)
                    .expect(200)
                    .expect((res) => {
                        const result = res.body as ResolvedSkillDto;
                        expect(result).toMatchObject(expectedObject);
                    });
            });
        });
    });

    describe(":repositoryId/skill/add_skill", () => {
        it("Create new Skill (without conflict) -> success", () => {
            // Create DTO
            const input: SkillCreationDto = {
                name: "New Skill",
                description: "This is a new skill",
                level: 1,
                // parentSkills: [],
                nestedSkills: [],
                owner: skillMap1.ownerId,
            };

            // Expected result
            // Omit extra attributes
            const { owner, ...relevantProperties } = input;
            // Expected data
            const expectedObject: SkillDto = {
                ...relevantProperties,
                id: expect.any(String),
                nestedSkills: [],
                parentSkills: [],
                repositoryId: skillMap1.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/${skillMap1.id}/skill/add_skill`)
                .send(input)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("Create new Skill (with conflict) -> ForbiddenException", () => {
            // Create DTO
            const input: SkillCreationDto = {
                name: skill2.name,
                description: "This is a new skill",
                level: skill2.level,
                // parentSkills: [],
                nestedSkills: [],
                owner: skillMapWithSkills.ownerId,
            };

            // Test: Create Skill
            return request(app.getHttpServer())
                .post(`/skill-repositories/${skillMapWithSkills.id}/skill/add_skill`)
                .send(input)
                .expect(403)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        expect.objectContaining({
                            error: "Forbidden",
                            message: "Skill already exists in specified repository",
                        }),
                    );
                });
        });
    });

    describe("PATCH:/skill-repositories/{repositoryId}", () => {
        it("Update Skill Map -> success", () => {
            // Update DTO
            const input: SkillRepositoryUpdateDto = {
                name: "Updated Skill Map",
                description: "This is an updated skill map",
                version: "2.0.1",
            };

            // Expected result
            const expectedObject = {
                ...skillMap3,
                ...input,
                skills: [skill1.id],
            };
            delete (expectedObject as any).ownerId;
            delete (expectedObject as any).createdAt;
            delete (expectedObject as any).updatedAt;

            // Test: Update Skill Map
            return request(app.getHttpServer())
                .patch(`/skill-repositories/${skillMap3.id}`)
                .send(input)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });
    });

    describe("DELETE:/skill-repositories/{repositoryId}", () => {
        it("Delete existing non-empty Skill Map -> success", () => {
            // Expected result
            const expectedObject = {
                ...skillMap3,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Update Skill Map
            return request(app.getHttpServer())
                .delete(`/skill-repositories/${skillMap3.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("Delete non-existing Skill Map -> 404", () => {
            // Test: Update Skill Map
            return request(app.getHttpServer())
                .delete(`/skill-repositories/a-non-existing-id`)
                .expect(404);
        });
    });

    describe("GET:/skill-repositories/skill/{skillId}", () => {
        it("Not existing ID -> NotFoundException", () => {
            return request(app.getHttpServer())
                .get(`/skill-repositories/skill/not-existing-id`)
                .expect(404)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        expect.objectContaining({
                            error: "Not Found",
                            message: "Specified skill not found: not-existing-id",
                        }),
                    );
                });
        });

        it("Existing ID -> Skill", () => {
            // Expected result
            const expectedObject: SkillDto = {
                ...SkillDto.createFromDao(skill2),
                nestedSkills: [nestedSkill1.id],
            };

            return request(app.getHttpServer())
                .get(`/skill-repositories/skill/${skill2.id}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as SkillDto;
                    expect(result).toMatchObject(expectedObject);
                });
        });
    });

    describe("PATCH:/skill-repositories/skill/{skillId}", () => {
        it("Update existing Skill -> 200 (success)", () => {
            const input: SkillUpdateDto = {
                name: "Updated Skill",
                description: "This is an updated skill",
                level: 2,
                nestedSkills: [nestedSkill1.id],
            };

            const expectedObject: SkillDto = {
                name: "Updated Skill",
                description: "This is an updated skill",
                level: 2,
                nestedSkills: [nestedSkill1.id],
                parentSkills: [],
                id: skill1.id,
                repositoryId: skillMap3.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            return request(app.getHttpServer())
                .patch(`/skill-repositories/skill/${skill1.id}`)
                .send(input)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("Update non-existing Skill -> 404", () => {
            const input: SkillUpdateDto = {
                name: "Updated Skill",
                description: "This is an updated skill",
                level: 2,
                nestedSkills: [nestedSkill1.id],
            };

            return request(app.getHttpServer())
                .patch(`/skill-repositories/skill/not-existing-id`)
                .send(input)
                .expect(404);
        });
    });

    describe("DELETE:/skill-repositories/skill/deleteWithoutCheck/{skillId}", () => {
        it("Delete unused Skill -> success", () => {
            const expectedObject: any = {
                ...skill1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete expectedObject.nestedSkills;

            return request(app.getHttpServer())
                .delete(`/skill-repositories/skill/deleteWithoutCheck/${skill1.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("Delete used Skill -> success", async () => {
            await dbUtils.createLearningUnit([skill1], []);

            const expectedObject: any = {
                ...skill1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };
            delete expectedObject.nestedSkills;

            return request(app.getHttpServer())
                .delete(`/skill-repositories/skill/deleteWithoutCheck/${skill1.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(expectedObject);
                });
        });

        it("Delete non-existing Skill -> 404", () => {
            return request(app.getHttpServer())
                .delete("/skill-repositories/skill/deleteWithoutCheck/a::non::existing::id")
                .expect(404);
        });
    });

    describe("DELETE:/skill-repositories/skill/deleteWithCheck/{skillId}", () => {
        it("Delete unused Skill -> success", () => {
            return request(app.getHttpServer())
                .delete(`/skill-repositories/skill/deleteWithCheck/${skill1.id}`)
                .expect(200);
        });

        it("Delete used Skill -> success", async () => {
            await dbUtils.createLearningPath("A-owner", [nestedSkill1]);

            // Skill2 is parent of used skill
            return request(app.getHttpServer())
                .delete(`/skill-repositories/skill/deleteWithCheck/${skill2.id}`)
                .expect(400);
        });

        it("Delete non-existing Skill -> 404", () => {
            return request(app.getHttpServer())
                .delete("/skill-repositories/skill/deleteWithCheck/a::non::existing::id")
                .expect(404);
        });
    });
});
