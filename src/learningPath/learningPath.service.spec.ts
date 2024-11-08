import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { LearningPathMgmtService } from "./learningPath.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import {
    CreateEmptyPathRequestDto,
    LearningPathDto,
    LearningPathListDto,
    UpdatePathRequestDto,
} from "./dto";
import { DefaultCostParameter, LearningUnit, getPath } from "../../nm-skill-lib/src";
import { SkillDto } from "../skills/dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";
import { LIFECYCLE, Skill, SkillMap, LearningUnit as PrismaLearningUnit } from "@prisma/client";
import "jest-expect-message";
import { isComposite, isDefined } from "../utils";

describe("LearningPath Service", () => {
    // Auxillary objects
    const config = new ConfigService();
    const db = new PrismaService(config);
    const luFactory = new LearningUnitFactory(db);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const learningPathService = new LearningPathMgmtService(db, luFactory);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("createLearningPath", () => {
        it("Create empty Path on empty DB-> LearningPath created", async () => {
            // Data to be created
            const creationDto: CreateEmptyPathRequestDto = {
                owner: "TestUser",
            };

            // Pre-Condition: Expected element does not exist
            await expect(
                learningPathService.loadLearningPaths({ owner: creationDto.owner }),
            ).resolves.toMatchObject([]);

            // Post-Condition: Element was created and DTO is returned
            const expected: Partial<LearningPathDto> = {
                id: expect.anything(),
                owner: creationDto.owner,
                pathGoals: [],
            };
            await expect(
                learningPathService.createEmptyLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
        });

        it("Create multiple Paths for same organization-> 2 LearningPaths with different IDs created", async () => {
            // Data to be created (will be used twice)
            const creationDto: CreateEmptyPathRequestDto = {
                owner: "TestOrganization",
            };

            // Pre-Condition: Expected element does not exist
            await expect(
                learningPathService.loadLearningPaths({ owner: creationDto.owner }),
            ).resolves.toMatchObject([]);

            // Post-Condition: Element was created and DTO is returned
            const expected: Partial<LearningPathDto> = {
                id: expect.anything(),
                owner: creationDto.owner,
                pathGoals: [],
            };

            // Test 1: Create first element -> Should be accepted
            await expect(
                learningPathService.createEmptyLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
            // Test 2: Create second element -> Should be accepted, too
            await expect(
                learningPathService.createEmptyLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
            // There should be 2 Paths defined for the same organization
            await expect(
                learningPathService.loadLearningPaths({ owner: creationDto.owner }),
            ).resolves.toMatchObject(
                expect.arrayContaining([
                    expect.objectContaining(expected),
                    expect.objectContaining(expected),
                ]),
            );
        });
    });

    describe("loadLearningPathList", () => {
        it("Empty DB -> Empty Result List", async () => {
            await expect(learningPathService.loadLearningPathList()).resolves.toEqual({
                learningPaths: [],
            });
        });

        it("One Path definition -> One result", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    owner: "Test-Orga-1",
                },
            });

            // Expected result
            const expected: LearningPathListDto = {
                learningPaths: [
                    {
                        id: creationResult.id,
                        owner: creationResult.owner,
                        title: "",
                        targetAudience: [],
                        lifecycle: LIFECYCLE.DRAFT,
                        requirements: [],
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                ],
            };

            // Test: Exactly one element with specified title found
            await expect(learningPathService.loadLearningPathList()).resolves.toMatchObject(
                expected,
            );
        });

        it("All Paths of a specific organization", async () => {
            // Precondition: Create 2 paths of an user and 1 paths of a different user
            const path1 = await db.learningPath.create({
                data: {
                    owner: "Test-Orga-1",
                },
            });
            const path2 = await db.learningPath.create({
                data: {
                    owner: "Test-Orga-1",
                },
            });
            await db.learningPath.create({
                data: {
                    owner: "Test-Orga-2",
                },
            });

            // Expected result
            const expected: LearningPathListDto = {
                learningPaths: expect.arrayContaining([
                    {
                        id: path1.id,
                        owner: path1.owner,
                        title: "",
                        targetAudience: [],
                        lifecycle: LIFECYCLE.DRAFT,
                        description: undefined,
                        requirements: [],
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                    {
                        id: path2.id,
                        owner: path2.owner,
                        title: "",
                        targetAudience: [],
                        lifecycle: LIFECYCLE.DRAFT,
                        description: undefined,
                        requirements: [],
                        pathGoals: [],
                        recommendedUnitSequence: [],
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                ]),
            };

            await expect(
                learningPathService.loadLearningPathList({ owner: path1.owner }),
            ).resolves.toMatchObject(expected);
        });
    });

    describe("updateLearningPath", () => {
        // Test data
        let skillMap: SkillMap;
        let skill1: Skill;
        let skill2: Skill;
        let skill3: Skill;
        let unit1: PrismaLearningUnit;
        let unit2: PrismaLearningUnit;
        let unit3: PrismaLearningUnit;

        beforeEach(async () => {
            await dbUtils.wipeDb();
            skillMap = await dbUtils.createSkillMap("New Owner", "Skill Map");
            skill1 = await dbUtils.createSkill(skillMap, "Skill1");
            skill2 = await dbUtils.createSkill(skillMap, "Skill2");
            skill3 = await dbUtils.createSkill(skillMap, "Skill3");
            unit1 = await dbUtils.createLearningUnit([skill1], []);
            unit2 = await dbUtils.createLearningUnit([skill2], [skill1]);
            unit3 = await dbUtils.createLearningUnit([skill3], [skill1]);
        });

        it("Full Update", async () => {
            // Test object, which shall be altered
            const initialPath = await dbUtils.createLearningPath("TestUser");

            // Test input
            const updateDto: UpdatePathRequestDto = {
                owner: "New Owner",
                title: "New Title",
                description: "New Description",
                targetAudience: ["New Audience"],
                lifecycle: LIFECYCLE.POOL,
                requirements: [skill1.id],
                pathGoals: [skill2.id],
                recommendedUnitSequence: [unit1.id, unit2.id],
            };

            // Precondition: initialPath does not share any properties with updateDto
            expect(initialPath.title).not.toEqual(updateDto.title);
            expect(initialPath.owner).not.toEqual(updateDto.owner);
            expect(initialPath.description).not.toEqual(updateDto.description);
            expect(initialPath.targetAudience).not.toEqual(updateDto.targetAudience);
            expect(initialPath.lifecycle).not.toEqual(updateDto.lifecycle);
            expect(initialPath.requirements).toEqual([]);
            expect(initialPath.pathTeachingGoals).toEqual([]);
            expect(initialPath.recommendedUnitSequence).toBeNull();

            // Expected result
            // Non-Null Assertion (! operator, may cause runtime errors) used, because:
            // * UpdatePathRequestDto allows null values
            // * Manually ensured that all values are set
            // * Used only in test
            const expected: LearningPathDto = {
                id: initialPath.id,
                owner: updateDto.owner!,
                title: updateDto.title!,
                targetAudience: updateDto.targetAudience!,
                description: updateDto.description!,
                lifecycle: LIFECYCLE.POOL,
                requirements: updateDto.requirements!,
                pathGoals: updateDto.pathGoals!,
                recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            };

            // Test: Update element
            await expect(
                learningPathService.updateLearningPath(initialPath.id, updateDto),
            ).resolves.toMatchObject(expected);
        });

        describe("Partial Update", () => {
            let initialPath: LearningPathDto;

            beforeEach(async () => {
                // Test object, which shall be altered
                const emptyPath = await dbUtils.createLearningPath("TestUser");
                const updateDto: UpdatePathRequestDto = {
                    owner: "TestUser",
                    title: "A Title",
                    description: "A Description",
                    targetAudience: ["An Audience"],
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };
                initialPath = await learningPathService.updateLearningPath(emptyPath.id, updateDto);

                const expected: LearningPathDto = {
                    id: initialPath.id,
                    owner: updateDto.owner!,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    targetAudience: updateDto.targetAudience!,
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: updateDto.requirements!,
                    pathGoals: updateDto.pathGoals!,
                    recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                expect(initialPath, "beforeAll() failed: Could not configure test object", {
                    showPrefix: false,
                }).toMatchObject(expected);
            });

            it("owner", async () => {
                const updateDto: UpdatePathRequestDto = {
                    owner: "New Owner",
                };
                const expected: LearningPathDto = {
                    ...initialPath,
                    owner: updateDto.owner!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("title", async () => {
                const updateDto: UpdatePathRequestDto = {
                    title: "New Title",
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    title: updateDto.title!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("description", async () => {
                const updateDto: UpdatePathRequestDto = {
                    description: "New Description",
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    description: updateDto.description!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("targetAudience", async () => {
                const updateDto: UpdatePathRequestDto = {
                    targetAudience: ["New Audience"],
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    targetAudience: updateDto.targetAudience!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("lifecycle", async () => {
                const updateDto: UpdatePathRequestDto = {
                    lifecycle: LIFECYCLE.POOL,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    lifecycle: updateDto.lifecycle!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("requirements", async () => {
                const updateDto: UpdatePathRequestDto = {
                    requirements: [skill3.id],
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    requirements: [skill3.id],
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("pathGoals", async () => {
                const updateDto: UpdatePathRequestDto = {
                    pathGoals: [skill3.id],
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    pathGoals: [skill3.id],
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("recommendedUnitSequence", async () => {
                const updateDto: UpdatePathRequestDto = {
                    recommendedUnitSequence: [unit1.id, unit2.id, unit3.id],
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    recommendedUnitSequence: [unit1.id, unit2.id, unit3.id],
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });
        });

        describe("Partial Delete", () => {
            let initialPath: LearningPathDto;

            beforeEach(async () => {
                // Test object, which shall be altered
                const emptyPath = await dbUtils.createLearningPath("TestUser");
                const updateDto: UpdatePathRequestDto = {
                    owner: "TestUser",
                    title: "A Title",
                    description: "A Description",
                    targetAudience: ["An Audience"],
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };
                initialPath = await learningPathService.updateLearningPath(emptyPath.id, updateDto);

                const expected: LearningPathDto = {
                    id: initialPath.id,
                    owner: updateDto.owner!,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    targetAudience: updateDto.targetAudience!,
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: updateDto.requirements!,
                    pathGoals: updateDto.pathGoals!,
                    recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                expect(initialPath, "beforeAll() failed: Could not configure test object", {
                    showPrefix: false,
                }).toMatchObject(expected);
            });

            it("description", async () => {
                const updateDto: UpdatePathRequestDto = {
                    description: null,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    description: undefined,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("targetAudience", async () => {
                const updateDto: UpdatePathRequestDto = {
                    targetAudience: null,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    targetAudience: [],
                    updatedAt: expect.any(String),
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("requirements", async () => {
                const updateDto: UpdatePathRequestDto = {
                    requirements: null,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    requirements: [],
                    updatedAt: expect.any(String),
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("pathGoals", async () => {
                const updateDto: UpdatePathRequestDto = {
                    pathGoals: null,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    pathGoals: [],
                    updatedAt: expect.any(String),
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("recommendedUnitSequence", async () => {
                const updateDto: UpdatePathRequestDto = {
                    recommendedUnitSequence: null,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    recommendedUnitSequence: [],
                    updatedAt: expect.any(String),
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });
        });

        describe("Update of POOLED Learning-Path", () => {
            let initialPath: LearningPathDto;

            beforeEach(async () => {
                // Test object, which shall be altered
                const emptyPath = await dbUtils.createLearningPath("TestUser");
                const updateDto: UpdatePathRequestDto = {
                    owner: "TestUser",
                    title: "A Title",
                    description: "A Description",
                    targetAudience: ["An Audience"],
                    lifecycle: LIFECYCLE.POOL,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };
                initialPath = await learningPathService.updateLearningPath(emptyPath.id, updateDto);

                const expected: LearningPathDto = {
                    id: initialPath.id,
                    owner: updateDto.owner!,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    targetAudience: updateDto.targetAudience!,
                    lifecycle: LIFECYCLE.POOL,
                    requirements: updateDto.requirements!,
                    pathGoals: updateDto.pathGoals!,
                    recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                expect(initialPath, "beforeAll() failed: Could not configure test object", {
                    showPrefix: false,
                }).toMatchObject(expected);
            });

            it("description", async () => {
                const updateDto: UpdatePathRequestDto = {
                    description: "A new description",
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    description: updateDto.description!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("lifecycle: ARCHIVED -> success", async () => {
                const updateDto: UpdatePathRequestDto = {
                    lifecycle: LIFECYCLE.ARCHIVED,
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    lifecycle: updateDto.lifecycle!,
                    updatedAt: expect.any(String),
                };
                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).resolves.toMatchObject(expected);
            });

            it("lifecycle: DRAFT -> Forbidden", async () => {
                const updateDto: UpdatePathRequestDto = {
                    lifecycle: LIFECYCLE.DRAFT,
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).rejects.toThrow(ForbiddenException);
            });

            it("Forbidden Properties", async () => {
                const updateDto: UpdatePathRequestDto = {
                    owner: "A new owner",
                    title: "A new title",
                    targetAudience: ["A new audience"],
                    requirements: [skill3.id],
                    pathGoals: [skill1.id],
                };

                try {
                    await learningPathService.updateLearningPath(initialPath.id, updateDto);
                    fail("Expected ForbiddenException");
                } catch (e) {
                    expect(e).toBeInstanceOf(ForbiddenException);
                    const msg = (e as ForbiddenException).message;
                    const expectedWarnings = Object.keys(updateDto);
                    for (const warning of expectedWarnings) {
                        expect(msg).toContain(warning);
                    }
                }
            });
        });

        describe("Update of ARCHIVED Learning-Path", () => {
            let initialPath: LearningPathDto;

            beforeEach(async () => {
                // Test object, which shall be altered
                const emptyPath = await dbUtils.createLearningPath("TestUser");
                const updateDto: UpdatePathRequestDto = {
                    owner: "TestUser",
                    title: "A Title",
                    description: "A Description",
                    targetAudience: ["An Audience"],
                    lifecycle: LIFECYCLE.ARCHIVED,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };
                initialPath = await learningPathService.updateLearningPath(emptyPath.id, updateDto);

                const expected: LearningPathDto = {
                    id: initialPath.id,
                    owner: updateDto.owner!,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    targetAudience: updateDto.targetAudience!,
                    lifecycle: LIFECYCLE.ARCHIVED,
                    requirements: updateDto.requirements!,
                    pathGoals: updateDto.pathGoals!,
                    recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                expect(initialPath, "beforeAll() failed: Could not configure test object", {
                    showPrefix: false,
                }).toMatchObject(expected);
            });

            it("Any change forbidden", async () => {
                const updateDto: UpdatePathRequestDto = {
                    description: "A new Description",
                };

                await expect(
                    learningPathService.updateLearningPath(initialPath.id, updateDto),
                ).rejects.toThrow(ForbiddenException);
            });
        });

        describe("Scenarios", () => {
            let initialPath: LearningPathDto;

            beforeEach(async () => {
                // Test object, which shall be altered
                const emptyPath = await dbUtils.createLearningPath("TestUser");
                const updateDto: UpdatePathRequestDto = {
                    owner: "TestUser",
                    title: "A Title",
                    description: "A Description",
                    targetAudience: ["An Audience"],
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: [skill1.id],
                    pathGoals: [skill2.id],
                    recommendedUnitSequence: [unit1.id, unit2.id],
                };
                initialPath = await learningPathService.updateLearningPath(emptyPath.id, updateDto);

                const expected: LearningPathDto = {
                    id: initialPath.id,
                    owner: updateDto.owner!,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    targetAudience: updateDto.targetAudience!,
                    lifecycle: LIFECYCLE.DRAFT,
                    requirements: updateDto.requirements!,
                    pathGoals: updateDto.pathGoals!,
                    recommendedUnitSequence: updateDto.recommendedUnitSequence!,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                };

                expect(
                    initialPath,
                    "Scenarios::beforeAll() failed: Could not configure test object",
                    {
                        showPrefix: false,
                    },
                ).toMatchObject(expected);

                // Create 5.000 units that should not be part of the path, but need to be considered...
                const otherMap = await dbUtils.createSkillMap("New Owner", "Skill Map 2");
                const decoySkill = await dbUtils.createSkill(otherMap, `Decoy Skill`);
                // Needs to be executed in parallel to avoid timeout by Jess
                await Promise.all(
                    Array.from(
                        { length: 5000 },
                        async (_obj, _i) => await dbUtils.createLearningUnit([decoySkill], []),
                    ),
                );
            });

            it("Stress Test: 5000 units of other paths", async () => {
                // Perform update of the path -> Should not take too long / fail
                const updateDto: UpdatePathRequestDto = {
                    title: "Updated Title",
                    description: "Will trigger path validation",
                };

                const expected: LearningPathDto = {
                    ...initialPath,
                    title: updateDto.title!,
                    description: updateDto.description!,
                    updatedAt: expect.any(String),
                };

                const start = Date.now();
                const result = await learningPathService.updateLearningPath(
                    initialPath.id,
                    updateDto,
                );
                const end = Date.now();

                expect(result).toMatchObject(expected);
                // Update should take less than 1 second
                expect(end - start).toBeLessThan(1000);
            });
        });
    });

    describe("getLearningPath", () => {
        it("Empty DB -> Error", async () => {
            await expect(learningPathService.getLearningPath("anyID")).rejects.toThrow(
                NotFoundException,
            );
        });

        it("ID of existing element -> Specified element retrieved", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    owner: "TestUser",
                },
            });

            const expectedResult: Partial<LearningPathDto> = {
                id: creationResult.id,
                owner: creationResult.owner,
            };
            await expect(
                learningPathService.getLearningPath(creationResult.id),
            ).resolves.toMatchObject(expect.objectContaining(expectedResult));
        });

        it("Wrong ID -> Error", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    owner: "TestUser",
                },
            });

            await expect(
                learningPathService.getLearningPath(creationResult.id + "_wrongID"),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("definePreferredPath", () => {
        let map: SkillMap;
        let [skill1, skill2, skill3]: (Skill & {
            nestedSkills: { id: string }[];
            parentSkills?: { id: string }[];
        })[] = [];
        let [skill1Dto, skill2Dto, skill3Dto]: SkillDto[] = [];

        beforeEach(async () => {
            // Create three learning units which can be shuffled
            map = await dbUtils.createSkillMap("user1", "OrderedSkillMap");
            skill1 = await dbUtils.createSkill(map, "Skill1");
            skill2 = await dbUtils.createSkill(map, "Skill2");
            skill3 = await dbUtils.createSkill(map, "Skill3");
            await dbUtils.createLearningUnit([skill1], []);
            await dbUtils.createLearningUnit([skill2], []);
            await dbUtils.createLearningUnit([skill3], [skill1, skill2]);
            skill1Dto = SkillDto.createFromDao(skill1);
            skill2Dto = SkillDto.createFromDao(skill2);
            skill3Dto = SkillDto.createFromDao(skill3);
        });

        it("Non existent Learning Unit specified -> NotFoundException", async () => {
            await expect(
                learningPathService.definePreferredPath(["non existent unit ID"], "anyID"),
            ).rejects.toThrow(NotFoundException);
        });

        it("Ordering defined -> LearningPath updated", async () => {
            // Pre-condition: Determine default path produced by the algorithm
            const path = getPath({
                skills: [skill1Dto, skill2Dto, skill3Dto],
                learningUnits: await findAll(db),
                goal: [skill3Dto],
                knowledge: [],
                isComposite,
                costOptions: DefaultCostParameter,
            });
            expect(path).not.toBeNull();

            // Test: Exchange first and second unit
            const unitOrdering = path!.path.map((p) => p.origin?.id).filter(isDefined);
            [unitOrdering[0], unitOrdering[1]] = [unitOrdering[1], unitOrdering[0]];
            await learningPathService.definePreferredPath(unitOrdering, "anyID");

            // Post-condition: Check that the path is now different (according to spec of unitOrdering)
            const newPath = getPath({
                skills: [skill1Dto, skill2Dto, skill3Dto],
                learningUnits: await findAll(db),
                goal: [skill3Dto],
                knowledge: [],
                isComposite,
                costOptions: DefaultCostParameter,
            });
            expect(newPath).not.toBeNull();
            const newOrder = newPath!.path.map((p) => p.origin?.id).filter(isDefined);
            expect(newOrder).toEqual(unitOrdering);
        });

        it("Empty preferred path -> no action", async () => {
            // Tests that no exception will be thrown
            await learningPathService.definePreferredPath([], "anyID");
        });
    });
});

async function findAll_internal(db: PrismaService) {
    return await db.learningUnit.findMany({
        include: {
            requirements: {
                include: {
                    nestedSkills: true,
                },
            },
            teachingGoals: {
                include: {
                    nestedSkills: true,
                },
            },
            orderings: {
                include: {
                    suggestedSkills: {
                        include: {
                            nestedSkills: true,
                        },
                    },
                },
            },
        },
    });
}

async function findAll(db: PrismaService) {
    const results: LearningUnit[] = (await findAll_internal(db)).map((lu) => ({
        id: lu.id,
        requiredSkills: lu.requirements.map((skill) => SkillDto.createFromDao(skill)),
        teachingGoals: lu.teachingGoals.map((skill) => SkillDto.createFromDao(skill)),
        suggestedSkills: lu.orderings
            .flatMap((ordering) => ordering.suggestedSkills)
            // Avoid duplicates which would increase the weight of the skill
            .filter(
                (skill, index, array) => index === array.findIndex((elem) => elem.id === skill.id),
            )
            .map((skill) => SkillDto.createFromDao(skill))
            .map((skill) => ({
                weight: 0.1,
                skill: skill,
            })),
    }));

    return results;
}
