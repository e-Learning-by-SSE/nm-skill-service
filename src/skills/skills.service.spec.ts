import { DbTestUtils } from "../DbTestUtils";
import { SkillMgmtService } from "./skill.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import {
    SkillCreationDto,
    ResolvedSkillDto,
    SkillRepositoryCreationDto,
    SkillRepositoryDto,
    SkillRepositoryListDto,
    SkillRepositoryUpdateDto,
    SkillDto,
    SkillListDto,
} from "./dto";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ACCESS_RIGHTS, Skill, SkillMap } from "@prisma/client";
import { UnresolvedSkillRepositoryDto } from "./dto/unresolved-skill-repository.dto";
import { SkillRepositoryService } from "./skill-repository.service";
import { SkillUpdateDto } from "./dto/skill-update.dto";

describe("Skill Service", () => {
    // Auxillary objects
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const repositoryService = new SkillRepositoryService(db);
    const skillService = new SkillMgmtService(db, repositoryService);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("findSkillRepositories", () => {
        it("Empty DB -> Empty ResultList", async () => {
            // Precondition: No Skill-Maps defined

            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

            // Test: Empty result list
            await expect(
                repositoryService.findSkillRepositories(null, null, null, null, null),
            ).resolves.toEqual({
                repositories: [],
            });
        });

        it("Query for not existing Owner-ID -> Empty ResultList", async () => {
            // Precondition: Some Skill-Maps defined
            await db.skillMap.create({
                data: {
                    name: "Test",
                    ownerId: "User-1",
                },
            });
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

            // Test: Empty result list
            await expect(
                repositoryService.findSkillRepositories(null, null, "User-2", null, null),
            ).resolves.toEqual({
                repositories: [],
            });
        });

        it("Query for existing Owner-ID -> ResultList with exact match", async () => {
            // Precondition: Some Skill-Maps defined
            const firstCreationResult = await db.skillMap.create({
                data: {
                    name: "Test",
                    ownerId: "User-1",
                },
            });
            await db.skillMap.create({
                data: {
                    name: "Test2",
                    ownerId: "User-2",
                },
            });
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

            // Test: ResultList should contain DTO representation of first element
            const expectedResult: Partial<SkillRepositoryDto> = {
                id: firstCreationResult.id,
                name: firstCreationResult.name,
                owner: firstCreationResult.ownerId,
            };
            const expectedList: SkillRepositoryListDto = {
                repositories: [expect.objectContaining(expectedResult)],
            };
            await expect(
                repositoryService.findSkillRepositories(null, null, "User-1", null, null),
            ).resolves.toMatchObject(expectedList);
        });

        it("Query for repository name by StringFilter (Containment) -> ResultList with matches", async () => {
            // Precondition: Some Skill-Maps defined
            const firstCreationResult = await db.skillMap.create({
                data: {
                    name: "Test",
                    ownerId: "User-1",
                },
            });
            const secondCreationResult = await db.skillMap.create({
                data: {
                    name: "Test 2",
                    ownerId: "User-2",
                },
            });
            // Should not be found
            await db.skillMap.create({
                data: {
                    name: "A completely different name",
                    ownerId: "User-1",
                },
            });
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: ResultList should contain DTO representation all elements that contain the name "Test"
            const expectedList: SkillRepositoryListDto = {
                repositories: [
                    expect.objectContaining({
                        id: firstCreationResult.id,
                        name: firstCreationResult.name,
                        owner: firstCreationResult.ownerId,
                    }),
                    expect.objectContaining({
                        id: secondCreationResult.id,
                        name: secondCreationResult.name,
                        owner: secondCreationResult.ownerId,
                    }),
                ],
            };
            await expect(
                repositoryService.findSkillRepositories(
                    null,
                    null,
                    null,
                    { contains: "Test", mode: "insensitive" },
                    null,
                ),
            ).resolves.toMatchObject(expectedList);
        });

        it("Test Pagination (Page)", async () => {
            // Precondition: Some Skill-Maps defined
            const skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            const skillMap2 = await db.skillMap.create({
                data: {
                    name: "Second Map",
                    ownerId: "User-1",
                },
            });
            const skillMap3 = await db.skillMap.create({
                data: {
                    name: "Third Map",
                    ownerId: "User-1",
                },
            });
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Retrieve all 3 pages (with pagesize 1)
            await expect(
                repositoryService.findSkillRepositories(0, 1, null, null, null),
            ).resolves.toMatchObject({
                repositories: [
                    expect.objectContaining({
                        name: skillMap1.name,
                        id: skillMap1.id,
                        owner: skillMap1.ownerId,
                    }),
                ],
            });
            await expect(
                repositoryService.findSkillRepositories(1, 1, null, null, null),
            ).resolves.toMatchObject({
                repositories: [
                    expect.objectContaining({
                        name: skillMap2.name,
                        id: skillMap2.id,
                        owner: skillMap2.ownerId,
                    }),
                ],
            });
            await expect(
                repositoryService.findSkillRepositories(2, 1, null, null, null),
            ).resolves.toMatchObject({
                repositories: [
                    expect.objectContaining({
                        name: skillMap3.name,
                        id: skillMap3.id,
                        owner: skillMap3.ownerId,
                    }),
                ],
            });
        });
        it("Test Pagination (Pagesize)", async () => {
            // Precondition: Some Skill-Maps defined
            const skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            const skillMap2 = await db.skillMap.create({
                data: {
                    name: "Second Map",
                    ownerId: "User-1",
                },
            });
            const skillMap3 = await db.skillMap.create({
                data: {
                    name: "Third Map",
                    ownerId: "User-1",
                },
            });
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Retrieve all 3 pages (with pagesize 2)
            await expect(
                repositoryService.findSkillRepositories(0, 2, null, null, null),
            ).resolves.toMatchObject({
                repositories: [
                    expect.objectContaining({
                        name: skillMap1.name,
                        id: skillMap1.id,
                        owner: skillMap1.ownerId,
                    }),
                    expect.objectContaining({
                        name: skillMap2.name,
                        id: skillMap2.id,
                        owner: skillMap2.ownerId,
                    }),
                ],
            });
            await expect(
                repositoryService.findSkillRepositories(2, 1, null, null, null),
            ).resolves.toMatchObject({
                repositories: [
                    expect.objectContaining({
                        name: skillMap3.name,
                        id: skillMap3.id,
                        owner: skillMap3.ownerId,
                    }),
                ],
            });
        });
    });

    describe("listSkillMaps", () => {
        let skillMap1: SkillMap;
        let skillMap2: SkillMap;
        let skillMap3: SkillMap;

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            skillMap2 = await db.skillMap.create({
                data: {
                    name: "Second Map",
                    ownerId: "User-1",
                },
            });
            skillMap3 = await db.skillMap.create({
                data: {
                    name: "Third Map",
                    ownerId: "User-2",
                },
            });
        });

        it("Not existing ID -> empty list", async () => {
            // Precondition: Some Skill-Maps defined
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Empty result list
            const expectedResult: SkillRepositoryListDto = {
                repositories: [],
            };
            await expect(repositoryService.listSkillMaps("not-existing-id")).resolves.toEqual(
                expectedResult,
            );
        });

        it("Existing ID (User-1) -> Return list of repositories owned by the user", async () => {
            // Precondition: Some Skill-Maps defined
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Expected result: 1st & 2nd map
            const maps: SkillRepositoryDto[] = [
                expect.objectContaining({
                    id: skillMap1.id,
                    name: skillMap1.name,
                    owner: skillMap1.ownerId,
                }),
                expect.objectContaining({
                    id: skillMap2.id,
                    name: skillMap2.name,
                    owner: skillMap2.ownerId,
                }),
            ];
            const expectedResult: SkillRepositoryListDto = {
                repositories: maps,
            };

            // Test: 1st & 2nd map (owned by User-1)
            await expect(repositoryService.listSkillMaps(skillMap1.ownerId)).resolves.toEqual(
                expectedResult,
            );
        });

        it("Existing ID (User-2) -> Return list of repository owned by the user", async () => {
            // Precondition: Some Skill-Maps defined
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Expected result: 3rd map
            const maps: SkillRepositoryDto[] = [
                expect.objectContaining({
                    id: skillMap3.id,
                    name: skillMap3.name,
                    owner: skillMap3.ownerId,
                }),
            ];
            const expectedResult: SkillRepositoryListDto = {
                repositories: maps,
            };

            // Test: 3rd map (owned by User-2)
            await expect(repositoryService.listSkillMaps(skillMap3.ownerId)).resolves.toEqual(
                expectedResult,
            );
        });
    });

    describe("loadSkillRepository", () => {
        let skillMap1: SkillMap;
        let skillMap2: SkillMap;
        let skillMap3: SkillMap;
        let skill1: Skill;
        let skill2: Skill;
        let nestedSkill1: Skill;

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            skillMap2 = await db.skillMap.create({
                data: {
                    name: "Second Map",
                    ownerId: "User-1",
                },
            });
            skillMap3 = await db.skillMap.create({
                data: {
                    name: "Third Map",
                    ownerId: "User-1",
                },
            });
            skill1 = await dbUtils.createSkill(skillMap2, "Skill 1");
            skill2 = await dbUtils.createSkill(skillMap2, "Skill 2");
            await dbUtils.createSkill(skillMap3, "Skill 3");
            nestedSkill1 = await dbUtils.createSkill(skillMap2, "Nested Skill 1", [skill2.id]);
        });

        it("Existing RepositoryId -> Success", async () => {
            // Test: Load Skill-Map by ID
            const expectedResult: Partial<SkillRepositoryDto> = {
                id: skillMap1.id,
                name: skillMap1.name,
                owner: skillMap1.ownerId,
            };
            await expect(
                repositoryService.loadSkillRepository(skillMap1.id),
            ).resolves.toMatchObject(expectedResult);
        });

        it("Not existing RepositoryId -> NotFoundException", async () => {
            // Test: Load Skill-Map by not existing ID
            await expect(
                repositoryService.loadSkillRepository("Not-existing-ID"),
            ).rejects.toThrowError(NotFoundException);
        });

        it("Existing Repository with skills -> Skills are resolved", async () => {
            // Expected result: skillMap2 with all (toplevel/nested) skills
            const expectedResult: Partial<UnresolvedSkillRepositoryDto> = {
                id: skillMap2.id,
                name: skillMap2.name,
                owner: skillMap2.ownerId,
                skills: [skill1.id, skill2.id, nestedSkill1.id].sort((a, b) => a.localeCompare(b)), // Skill3 belongs to different repository
            };

            // Test: Load Skill-Map by ID
            const result = await repositoryService.loadSkillRepository(skillMap2.id);
            result.skills.sort((a, b) => a.localeCompare(b));
            expect(result).toMatchObject(expectedResult);
        });
    });

    describe("getSkillRepository", () => {
        let skillMap3: SkillMap;

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            await db.skillMap.create({
                data: {
                    name: "Second Map",
                    ownerId: "User-1",
                },
            });
            skillMap3 = await db.skillMap.create({
                data: {
                    name: "Third Map",
                    ownerId: "User-2",
                },
            });
        });
        it("should successfully load the skill repository when the owner matches", async () => {
            // Precondition: Some Skill-Maps defined
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Load Skill-Map by ID and specify the correct owner
            const skillRepository = await repositoryService.getSkillRepository(
                "User-2",
                skillMap3.id,
            );

            // Assert: Ensure that the correct skill repository is loaded
            expect(skillRepository).toBeDefined();
            expect(skillRepository.ownerId).toBe("User-2");
        });
        it("should throw ForbiddenException when loading the repository of another owner for writing", async () => {
            // Precondition: Some Skill-Maps defined
            await expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Load Skill-Map by ID and specify owner (for writing)
            await expect(
                repositoryService.getSkillRepository("User-1", skillMap3.id),
            ).rejects.toThrowError(ForbiddenException);
        });
    });

    describe("createRepository", () => {
        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();
        });
        it("Create First Repository -> Success", async () => {
            // Precondition: No Skill-Maps defined
            const nSkillMapsDefined = await db.skillMap.aggregate({ _count: true });
            expect(nSkillMapsDefined).toEqual({ _count: 0 });

            // Test: Create first repository
            const creationDto: SkillRepositoryCreationDto = {
                name: "Test",
                ownerId: "User-1",
            };
            const expectation: Partial<SkillRepositoryDto> = {
                name: creationDto.name,
                owner: creationDto.ownerId,
                description: creationDto.description ?? undefined,
            };
            await expect(repositoryService.createRepository(creationDto)).resolves.toMatchObject(
                expectation,
            );
        });

        it("Create Second Repository with Naming Conflict -> ForbiddenException", async () => {
            // Precondition: One Skill-Map defined
            const firstMap = await db.skillMap.create({
                data: {
                    name: "Test",
                    ownerId: "User-1",
                },
            });
            expect(db.skillMap.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

            // Test: Create first repository
            const creationDto: SkillRepositoryCreationDto = {
                name: firstMap.name,
                ownerId: firstMap.ownerId,
                version: firstMap.version,
            };
            await expect(repositoryService.createRepository(creationDto)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });

    describe("getSkill", () => {
        let defaultSkillMap: SkillMap;

        beforeEach(async () => {
            defaultSkillMap = await dbUtils.createSkillMap("1", "Test");
        });

        it("Non existing ID -> NotFoundException", async () => {
            // Precondition: No Skill-Maps defined
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

            // Test: NotFoundException
            await expect(skillService.getResolvedSkill("anyID")).rejects.toThrowError(
                NotFoundException,
            );
        });

        it("Existing ID -> DTO representation", async () => {
            // Precondition: One skill exists
            const skill = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

            // Test: Load skill
            // Expected result: DTO representation of skill, without parent and nested skills
            const expectedResult: Partial<ResolvedSkillDto> = {
                id: skill.id,
                name: skill.name,
                level: skill.level,
                description: skill.description ?? undefined,
                nestedSkills: [],
            };
            await expect(skillService.getResolvedSkill(skill.id)).resolves.toMatchObject(
                expectedResult,
            );
        });

        it("One nested Skill", async () => {
            // Precondition: One skill exists
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2", [skill1.id]);
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 2 });

            // Test: Load skill
            // Expected result: DTO representation of skill, without parent and nested skills
            const expectedChild: Partial<ResolvedSkillDto> = {
                id: skill2.id,
                name: skill2.name,
                level: skill2.level,
                description: skill2.description ?? undefined,
                nestedSkills: [],
            };
            const expectedParent: Partial<ResolvedSkillDto> = {
                id: skill1.id,
                name: skill1.name,
                level: skill1.level,
                description: skill1.description ?? undefined,
                nestedSkills: [expect.objectContaining(expectedChild)],
            };
            await expect(skillService.getResolvedSkill(skill1.id)).resolves.toMatchObject(
                expectedParent,
            );
        });

        it("Skill multiple times nested", async () => {
            // Precondition: One skill exists
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2", [skill1.id]);
            const skill3 = await dbUtils.createSkill(
                defaultSkillMap,
                "Skill 3",
                [skill1.id, skill2.id],
                "This skill is nested below Skill 1 AND Skill 2",
            );
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 3 });

            // Test: Load skill
            // Expected result: DTO representation of skill, without parent and nested skills
            const expectedSkill3: Partial<ResolvedSkillDto> = {
                id: skill3.id,
                name: skill3.name,
                level: skill3.level,
                description: skill3.description ?? undefined,
                nestedSkills: [],
            };
            const expectedChild: Partial<ResolvedSkillDto> = {
                id: skill2.id,
                name: skill2.name,
                level: skill2.level,
                description: skill2.description ?? undefined,
                nestedSkills: [expect.objectContaining(expectedSkill3)],
            };
            const expectedParent: Partial<ResolvedSkillDto> = {
                id: skill1.id,
                name: skill1.name,
                level: skill1.level,
                description: skill1.description ?? undefined,
                nestedSkills: [
                    expect.objectContaining(expectedChild),
                    expect.objectContaining(expectedSkill3),
                ],
            };
            await expect(skillService.getResolvedSkill(skill1.id)).resolves.toMatchObject(
                expectedParent,
            );
        });
    });

    describe("deleteSkillWithCheck", () => {
        it("should delete a skill without children or usage", async () => {});

        it("should throw an error when trying to delete a skill in use", async () => {});

        it("should throw an error when trying to delete a skill with children in use", async () => {});
    });

    describe("createSkill", () => {
        let defaultSkillMap: SkillMap;

        beforeEach(async () => {
            defaultSkillMap = await dbUtils.createSkillMap("User-1", "Test", "A Description");
        });

        it("Create on Empty DB -> New DTO", async () => {
            // Precondition: No Skill-Maps defined
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 0 });

            // Test: Create skill
            const creationDto: SkillCreationDto = {
                owner: defaultSkillMap.ownerId,
                name: "Skill 1",
                level: 1,
                description: "A Description",
                nestedSkills: [],
            };

            // Expected result: DTO representation of skill, without parent and nested skills
            const expectedSkill: Partial<ResolvedSkillDto> = {
                name: creationDto.name,
                level: creationDto.level,
                description: creationDto.description,
                nestedSkills: [],
            };
            await expect(
                skillService.createSkill(defaultSkillMap.id, creationDto),
            ).resolves.toMatchObject(expectedSkill);
        });

        it("Existing Name -> ForbiddenException", async () => {
            // Precondition: One Skill defined
            const firstSkill = await db.skill.create({
                data: {
                    name: "Skill 1",
                    level: 1,
                    repositoryId: defaultSkillMap.id,
                },
            });
            await expect(db.skill.aggregate({ _count: true })).resolves.toEqual({ _count: 1 });

            // Test: Create skill
            const creationDto: SkillCreationDto = {
                owner: defaultSkillMap.ownerId,
                name: firstSkill.name,
                level: 2,
                description: "Another Description",
                nestedSkills: [],
            };

            // Expected result: Exception because of naming conflict
            await expect(
                skillService.createSkill(defaultSkillMap.id, creationDto),
            ).rejects.toThrowError(ForbiddenException);
        });
        it("Not known owner -> ForbiddenException", async () => {
            // Precondition: One Skill defined

            // Test: Create skill
            const creationDto: SkillCreationDto = {
                owner: "Unknown Owner",
                name: "Unknown Owner",
                level: 2,
                description: "Another Description",
                nestedSkills: [],
            };

            // Expected result: Exception because of naming conflict
            await expect(
                skillService.createSkill(defaultSkillMap.id, creationDto),
            ).rejects.toThrowError(ForbiddenException);
        });
    });

    describe("deleteRepository", () => {
        let defaultSkillMap: SkillMap;
        beforeEach(async () => {
            // Set up any necessary mocks or database state here
            await dbUtils.wipeDb();
        });

        it("should delete a repository when no skills are used in learning units", async () => {
            // Arrange: Mock the database skillMap.findUnique and skill.deleteMany methods
            defaultSkillMap = await dbUtils.createSkillMap("User-1", "Test", "A Description");
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2", [skill1.id]);
            const skill3 = await dbUtils.createSkill(
                defaultSkillMap,
                "Skill 3",
                [skill1.id, skill2.id],
                "This skill is nested below Skill 1 AND Skill 2",
            );

            const expectedResult: Partial<SkillMap> = {
                id: defaultSkillMap.id,
                name: defaultSkillMap.name,
                ownerId: defaultSkillMap.ownerId,
            };

            // Assert: Check that the repository and associated skills were deleted

            const result = await repositoryService.deleteRepository(defaultSkillMap.id);

            // Assert: Check that the repository and associated skills were deleted
            expect(result).toMatchObject(expectedResult);
            await expect(
                repositoryService.loadSkillRepository(defaultSkillMap.id),
            ).rejects.toThrowError(NotFoundException);
        });

        it("should throw NotFoundException when the repository is not found", async () => {
            // Arrange: Attempt to delete a non-existent repository
            const nonExistentRepositoryId = "non-existent-repo-id";

            // Act and Assert: Call the deleteRepository method and expect a NotFoundException
            await expect(
                repositoryService.deleteRepository(nonExistentRepositoryId),
            ).rejects.toThrowError(NotFoundException);
        });

        it("should throw NotFoundException when skills are used in learning units", async () => {
            // Arrange: Create a SkillMap with associated skills used in learning units
            defaultSkillMap = await dbUtils.createSkillMap("User-1", "Test", "A Description");
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2", [skill1.id]);
            const skill3 = await dbUtils.createSkill(
                defaultSkillMap,
                "Skill 3",
                [skill1.id, skill2.id],
                "This skill is nested below Skill 1 AND Skill 2",
            );

            // Create a learning unit that uses one of the skills
            await dbUtils.createLearningUnit([skill3], [skill3]);

            // Act and Assert: Call the deleteRepository method and expect a NotFoundException
            await expect(
                repositoryService.deleteRepository(defaultSkillMap.id),
            ).rejects.toThrowError(ForbiddenException);
        });
    });

    describe("loadAllSkills", () => {
        beforeEach(async () => {
            // Wipe the database before each test to ensure a clean state
            await dbUtils.wipeDb();
        });

        it("No data -> NotFoundException", async () => {
            let error;
            try {
                await skillService.loadAllSkills();
            } catch (e) {
                error = e;
            }

            // Assert: Check if the method correctly threw a NotFoundException
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe("Can not find any skills");
        });
    });

    describe("adaptRepository", () => {
        let defaultSkillMap: SkillMap;

        beforeEach(async () => {
            // Set up any necessary mocks or database state here
            await dbUtils.wipeDb();

            // Create a SkillMap with initial data
            defaultSkillMap = await dbUtils.createSkillMap(
                "User-1",
                "Initial Name",
                "Initial Description",
            );
        });

        it("Valid data -> data changed", async () => {
            const updatedDto: SkillRepositoryUpdateDto = {
                owner: "Updated Owner",
                access_rights: ACCESS_RIGHTS.PUBLIC,
                description: "Updated Description",
                name: "Updated Name",
                taxonomy: "Updated Taxonomy",
                version: "Updated Version",
            };

            // Act: Call the adaptRepository method to update the repository
            const updatedRepository = await repositoryService.adaptRepository(
                defaultSkillMap.id,
                updatedDto,
            );

            // Assert: Check that the repository was updated with the provided data
            const expectedResult: SkillRepositoryDto = {
                id: defaultSkillMap.id,
                owner: updatedDto.owner!,
                name: updatedDto.name!,
                description: updatedDto.description,
                access_rights: updatedDto.access_rights,
                taxonomy: updatedDto.taxonomy,
                version: updatedDto.version,
            };
            expect(updatedRepository).toMatchObject(expectedResult);
        });

        describe("Partial Updates", () => {
            let expectedPartialUpdateResult: SkillRepositoryDto;

            beforeEach(async () => {
                // Set up any necessary mocks or database state here
                await dbUtils.wipeDb();

                // Create a SkillMap with initial data
                defaultSkillMap = await dbUtils.createSkillMap(
                    "User-1",
                    "Initial Name",
                    "Initial Description",
                );

                // Simplifies the expected result for partial updates
                expectedPartialUpdateResult = {
                    id: defaultSkillMap.id,
                    owner: defaultSkillMap.ownerId,
                    name: defaultSkillMap.name,
                    description: defaultSkillMap.description!,
                    access_rights: defaultSkillMap.access_rights,
                    taxonomy: defaultSkillMap.taxonomy,
                    version: defaultSkillMap.version,
                };
            });

            it("Owner", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    owner: "New Owner",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    owner: updatedDto.owner!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });

            it("Name", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    name: "New Name",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    name: updatedDto.name!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });

            it("Description", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    description: "New Description",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    description: updatedDto.description!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });

            it("Taxonomy", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    taxonomy: "New Taxonomy",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    taxonomy: updatedDto.taxonomy!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });

            it("Version", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    version: "New Version",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    version: updatedDto.version!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });

            it("Access Rights", async () => {
                const updatedDto: SkillRepositoryUpdateDto = {
                    access_rights: "COMPANY",
                };

                // Act: Change only a single attribute
                const updatedRepository = await repositoryService.adaptRepository(
                    defaultSkillMap.id,
                    updatedDto,
                );

                // Assert: Check that the repository was updated with the provided data
                const expectedResult: SkillRepositoryDto = {
                    ...expectedPartialUpdateResult,
                    access_rights: updatedDto.access_rights!,
                };
                expect(updatedRepository).toMatchObject(expectedResult);
            });
        });

        it("Invalid ID -> NotFoundException", async () => {
            // Arrange: Attempt to update a non-existent repository
            const nonExistentRepositoryDto: SkillRepositoryUpdateDto = {
                owner: "A new Owner",
            };

            // Act and Assert: Call the adaptRepository method and expect a NotFoundException
            await expect(
                repositoryService.adaptRepository("non-existent-repo-id", nonExistentRepositoryDto),
            ).rejects.toThrowError(NotFoundException);
        });
    });

    describe("isSkillUsed", () => {
        it("should return false if the skill is not used in any learning unit", async () => {
            // Arrange: Create a skill, but don't associate it with any learning unit
            const skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            });
            const skill = await dbUtils.createSkill(skillMap1, "Skill A");

            // Act: Check if the skill is used
            const used = await skillService.isSkillUsed([skill.id]);

            // Assert: Ensure that the skill is not used
            expect(used).toBe(false);
        });

        it("should return true if the skill is used in at least one learning unit", async () => {
            const skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            }); // Arrange: Create a skill and associate it with a learning unit
            const skill = await dbUtils.createSkill(skillMap1, "Skill A");
            const learningUnit = await dbUtils.createLearningUnit([skill], []);

            // Act: Check if the skill is used
            const used = await skillService.isSkillUsed([skill.id]);

            // Assert: Ensure that the skill is used
            expect(used).toBe(true);
        });

        it("should return true if the skill is used as a requirement in a learning unit", async () => {
            const skillMap1 = await db.skillMap.create({
                data: {
                    name: "First Map",
                    ownerId: "User-1",
                },
            }); // Arrange: Create skills and a learning unit with the skill as a requirement
            const skill = await dbUtils.createSkill(skillMap1, "Skill A");
            await dbUtils.createLearningUnit([], [skill]);

            // Act: Check if the skill is used
            const used = await skillService.isSkillUsed([skill.id]);

            // Assert: Ensure that the skill is used
            expect(used).toBe(true);
        });
    });

    describe("updateSkill", () => {
        let defaultSkillMap: SkillMap;

        beforeEach(async () => {
            // Create a SkillMap with initial data
            defaultSkillMap = await dbUtils.createSkillMap(
                "User-1",
                "Test SkillMap",
                "Description",
            );
        });

        describe("Partial Updates", () => {
            let skill: Skill;
            let expectedPartialUpdateResult: SkillDto;

            beforeEach(async () => {
                // Create a skill with initial data
                skill = await dbUtils.createSkill(defaultSkillMap, "Skill 1", [], "Description", 1);

                // Simplifies the expected result for partial updates
                expectedPartialUpdateResult = {
                    id: skill.id,
                    name: skill.name,
                    level: skill.level,
                    description: skill.description!,
                    nestedSkills: [],
                    parentSkills: [],
                    createdAt: skill.createdAt.toISOString(),
                    updatedAt: expect.any(String),
                    repositoryId: skill.repositoryId,
                };
            });

            it("Name", async () => {
                const updatedDto: SkillUpdateDto = {
                    name: "New Name",
                };

                // Act: Change only a single attribute
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was updated with the provided data
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    name: updatedDto.name!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Level", async () => {
                const updatedDto: SkillUpdateDto = {
                    level: 42,
                };

                // Act: Change only a single attribute
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was updated with the provided data
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    level: updatedDto.level!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Description", async () => {
                const updatedDto: SkillUpdateDto = {
                    description: "New Description",
                };

                // Act: Change only a single attribute
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was updated with the provided data
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    description: updatedDto.description!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Nested Skills", async () => {
                const nested1 = await dbUtils.createSkill(defaultSkillMap, "Nested 1");
                const nested2 = await dbUtils.createSkill(defaultSkillMap, "Nested 2");

                const updatedDto: SkillUpdateDto = {
                    nestedSkills: [nested1.id, nested2.id],
                };

                // Act: Change only a single attribute
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was updated with the provided data
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    nestedSkills: updatedDto.nestedSkills!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Clear Nested Skills", async () => {
                const nested1 = await dbUtils.createSkill(defaultSkillMap, "Nested 1");
                const nested2 = await dbUtils.createSkill(defaultSkillMap, "Nested 2");
                const updatedDto: SkillUpdateDto = {
                    nestedSkills: [nested1.id, nested2.id],
                };

                // Precondition: Check that the nested skills were added
                let updatedSkill = await skillService.updateSkill(skill.id, updatedDto);
                let expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    nestedSkills: updatedDto.nestedSkills!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);

                // Act: Clear nested skills
                const clearedDto: SkillUpdateDto = {
                    nestedSkills: null,
                };

                updatedSkill = await skillService.updateSkill(skill.id, clearedDto);

                // Assert: Check that nested skills were cleared
                expectedResult = {
                    ...expectedPartialUpdateResult,
                    nestedSkills: [],
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Parent Skills", async () => {
                const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2");

                const updatedDto: SkillUpdateDto = {
                    parentSkills: [skill2.id],
                };

                // Act: Change only a single attribute
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was updated with the provided data
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    parentSkills: updatedDto.parentSkills!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("Clear Parent Skills", async () => {
                const skill2 = await dbUtils.createSkill(defaultSkillMap, "Skill 2");

                const updatedDto: SkillUpdateDto = {
                    parentSkills: [skill2.id],
                };

                // Precondition: Check that the parent skills were added
                let updatedSkill = await skillService.updateSkill(skill.id, updatedDto);
                let expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    parentSkills: updatedDto.parentSkills!,
                };
                expect(updatedSkill).toMatchObject(expectedResult);

                // Act: Clear parent skills
                const clearedDto: SkillUpdateDto = {
                    parentSkills: null,
                };

                updatedSkill = await skillService.updateSkill(skill.id, clearedDto);

                // Assert: Check that parent skills were cleared
                expectedResult = {
                    ...expectedPartialUpdateResult,
                    parentSkills: [],
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });

            it("RepositoryId", async () => {
                const trgSkillMap = await dbUtils.createSkillMap("User-1", "2nd SkillMap");

                // Act: Change repository
                const updatedDto: SkillUpdateDto = {
                    repositoryId: trgSkillMap.id,
                };
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the skill was moved to the new repository
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    repositoryId: updatedDto.repositoryId!,
                };
                const expectedSkillList = new SkillListDto();
                expectedSkillList.skills = [expectedResult];
                expect(updatedSkill).toMatchObject(expectedSkillList);
            });

            it("Clear Description", async () => {
                const updatedDto: SkillUpdateDto = {
                    description: null,
                };

                // Act: Clear description
                const updatedSkill = await skillService.updateSkill(skill.id, updatedDto);

                // Assert: Check that the description was cleared
                const expectedResult: SkillDto = {
                    ...expectedPartialUpdateResult,
                    description: undefined,
                };
                expect(updatedSkill).toMatchObject(expectedResult);
            });
        });

        describe("Update used skills", () => {
            it("Update used skill -> ForbiddenException", async () => {
                // Arrange: Create a skill and associate it with a learning unit
                const skill = await dbUtils.createSkill(defaultSkillMap, "Skill A");
                await dbUtils.createLearningUnit([skill], []);

                // Act: Change name of used skill
                const result = skillService.updateSkill(skill.id, { name: "New Name" });

                // Assert: Ensure that operation was rejected by a ForbiddenException
                await expect(result).rejects.toThrowError(ForbiddenException);
            });

            it("One new child is in use -> ForbiddenException", async () => {
                // Arrange: Create a skills and associate one of the skills with a learning unit
                const skill = await dbUtils.createSkill(defaultSkillMap, "Skill A");
                const newNested1 = await dbUtils.createSkill(defaultSkillMap, "Nested Skill 1");
                const newNested2 = await dbUtils.createSkill(defaultSkillMap, "Nested Skill 2");
                await dbUtils.createLearningUnit([newNested2], []);

                // Act: Add skills as nested skills
                const result = skillService.updateSkill(skill.id, {
                    nestedSkills: [newNested1.id, newNested2.id],
                });

                // Assert: Ensure that operation was rejected by a ForbiddenException
                await expect(result).rejects.toThrowError(ForbiddenException);
            });

            it("One child to be removed is in use -> ForbiddenException", async () => {
                // Arrange: Create a skills and associate one of the skills with a learning unit
                const skill = await dbUtils.createSkill(defaultSkillMap, "Skill A");
                await dbUtils.createSkill(defaultSkillMap, "Nested 1", [skill.id]);
                const nested2 = await dbUtils.createSkill(defaultSkillMap, "Nested 2", [skill.id]);
                await dbUtils.createLearningUnit([nested2], []);

                // Act: Remove a nested skill
                const result = skillService.updateSkill(skill.id, {
                    nestedSkills: [],
                });

                // Assert: Ensure that operation was rejected by a ForbiddenException
                await expect(result).rejects.toThrowError(ForbiddenException);
            });

            it("One new parent is in use -> ForbiddenException", async () => {
                // Arrange: Create a skills and associate one of the skills with a learning unit
                const skill = await dbUtils.createSkill(defaultSkillMap, "Skill A");
                const newParent1 = await dbUtils.createSkill(defaultSkillMap, "Parent Skill 1");
                const newParent2 = await dbUtils.createSkill(defaultSkillMap, "Parent Skill 2");
                await dbUtils.createLearningUnit([newParent2], []);

                // Act: Add skills as parent skills
                const result = skillService.updateSkill(skill.id, {
                    parentSkills: [newParent1.id, newParent2.id],
                });

                // Assert: Ensure that operation was rejected by a ForbiddenException
                await expect(result).rejects.toThrowError(ForbiddenException);
            });

            it("One parent to be removed is in use -> ForbiddenException", async () => {
                // Arrange: Create a skills and associate one of the skills with a learning unit
                const parent1 = await dbUtils.createSkill(defaultSkillMap, "Parent 1");
                const parent2 = await dbUtils.createSkill(defaultSkillMap, "Parent 2");
                const skill = await dbUtils.createSkill(defaultSkillMap, "Skill A", [
                    parent1.id,
                    parent2.id,
                ]);
                await dbUtils.createLearningUnit([parent2], []);

                // Act: Remove a nested skill
                const result = skillService.updateSkill(skill.id, {
                    parentSkills: [],
                });

                // Assert: Ensure that operation was rejected by a ForbiddenException
                await expect(result).rejects.toThrowError(ForbiddenException);
            });
        });

        it("Update to create cycle (by Parent) -> ForbiddenException", async () => {
            // Arrange: Create a nested skill structure
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1");
            const nestedSkill = await dbUtils.createSkill(defaultSkillMap, "Nested Skill", [
                skill1.id,
            ]);

            // Act: Change name of non-existing skill
            const result = skillService.updateSkill(skill1.id, {
                parentSkills: [nestedSkill.id],
            });

            // Assert: Ensure that operation was rejected by a NotFoundException
            await expect(result).rejects.toThrowError(ForbiddenException);
        });

        it("Update to create cycle (by Child) -> ForbiddenException", async () => {
            // Arrange: Create a nested skill structure
            const parentSkill = await dbUtils.createSkill(defaultSkillMap, "Parent Skill");
            const skill1 = await dbUtils.createSkill(defaultSkillMap, "Skill 1", [parentSkill.id]);

            // Act: Change name of non-existing skill
            const result = skillService.updateSkill(skill1.id, {
                nestedSkills: [parentSkill.id],
            });

            // Assert: Ensure that operation was rejected by a NotFoundException
            await expect(result).rejects.toThrowError(ForbiddenException);
        });
    });

    describe("moveSkillToRepository", () => {
        let [originMap, destMap]: SkillMap[] = [];
        let trgSkill: Skill;

        beforeEach(async () => {
            originMap = await dbUtils.createSkillMap(
                "User-1",
                "Origin Map",
                "The origin skill map",
            );
            destMap = await dbUtils.createSkillMap(
                "User-1",
                "Destination Map",
                "The target of the movement operation",
            );

            // Arrange: Create a skill in the origin repository
            trgSkill = await dbUtils.createSkill(originMap, "Skill 1");
        });

        it("No children; no parents; no usage -> success", async () => {
            // Act: Move the skill to the destination repository
            const result = await skillService.moveSkillToRepository(trgSkill.id, destMap.id);

            // Assert: Ensure that the skill was moved successfully
            const resultSkill = await db.skill.findUnique({ where: { id: trgSkill.id } });
            expect(resultSkill!.repositoryId).toBe(destMap.id);
            expect(result.skills.length).toBe(1);
            expect(result.skills[0].repositoryId).toBe(destMap.id);
        });

        it("Multiple moveable children; no parents; no usage -> success", async () => {
            // Arrange: Create nested skills in the origin repository
            const nestedSkill1 = await dbUtils.createSkill(originMap, "Nested 1", [trgSkill.id]);
            await dbUtils.createSkill(originMap, "Nested 2", [nestedSkill1.id]);

            // Act: Move the skill to the destination repository
            const result = await skillService.moveSkillToRepository(trgSkill.id, destMap.id);

            // Assert: Ensure that the skill was moved successfully
            const resultSkill = await db.skill.findUnique({ where: { id: trgSkill.id } });
            expect(resultSkill!.repositoryId).toBe(destMap.id);
            expect(result.skills.length).toBe(3);
            result.skills.forEach((skill) => {
                expect(skill.repositoryId).toBe(destMap.id);
            });
        });

        it("Multiple children; additional parents; no usage -> ForbiddenException", async () => {
            // Arrange: Create nested skills in the origin repository + additional parent
            const skill2 = await dbUtils.createSkill(originMap, "Skill 2");
            const nestedSkill1 = await dbUtils.createSkill(originMap, "Nested 1", [trgSkill.id]);
            await dbUtils.createSkill(originMap, "Nested 2", [nestedSkill1.id, skill2.id]);

            // Act: Move the skill to the destination repository
            const result = skillService.moveSkillToRepository(trgSkill.id, destMap.id);

            // Assert: Ensure that operation was rejected
            await expect(result).rejects.toThrowError(ForbiddenException);
        });

        it("No children; no parents; usage in LearningUnit -> ForbiddenException", async () => {
            // Arrange: Use the skill in a learning unit
            await dbUtils.createLearningUnit([trgSkill], []);

            // Act: Move the skill to the destination repository
            const result = skillService.moveSkillToRepository(trgSkill.id, destMap.id);

            // Assert: Ensure that operation was rejected
            await expect(result).rejects.toThrowError(ForbiddenException);
        });

        it("Non existing skill -> NotFoundException", async () => {
            // Act: Move the skill to the destination repository
            const result = skillService.moveSkillToRepository("non::existing::id", destMap.id);

            // Assert: Ensure that operation was rejected
            await expect(result).rejects.toThrowError(NotFoundException);
        });
    });
});
