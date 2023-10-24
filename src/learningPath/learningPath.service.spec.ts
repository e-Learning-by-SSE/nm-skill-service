import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { LearningPathMgmtService } from "./learningPath.service";
import { NotFoundException } from "@nestjs/common";
import { CreateEmptyPathRequestDto, LearningPathDto, PreferredPathDto } from "./dto";
import { LearningUnit, getPath } from "../../nm-skill-lib/src";
import { SkillDto } from "../skills/dto";
import { LearningUnitFactory } from "../learningUnit/learningUnitFactory";

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

    describe("loadAllLearningPaths", () => {
        it("Empty DB -> Empty Result List", async () => {
            await expect(learningPathService.loadLearningPaths()).resolves.toEqual([]);
        });

        it("One Path definition -> One result", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    owner: "TestUser",
                },
            });

            // Test: Exactly one element with specified title found
            await expect(learningPathService.loadLearningPaths()).resolves.toMatchObject([
                expect.objectContaining({ owner: creationResult.owner }),
            ]);
        });

        it("Select by Title -> Not all elements returned", async () => {
            // Precondition: 2 elements exist (do not rely on Service for its creation)
            const creationResult1 = await db.learningPath.create({
                data: {
                    owner: "TestUser",
                },
            });
            await db.learningPath.create({
                data: {
                    owner: "TestUser2",
                },
            });

            // Test: Only first element found
            await expect(
                learningPathService.loadLearningPaths({ owner: creationResult1.owner }),
            ).resolves.toMatchObject([expect.objectContaining({ owner: creationResult1.owner })]);
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
                goals: [],
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
                goals: [],
            };

            // Test 1: Create first element -> Should be accepted
            await expect(
                learningPathService.createEmptyLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
            // Test 2: Create second element -> Should be accepted, too
            await expect(
                learningPathService.createEmptyLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
            // There should be 2 PAths defined for the same organization
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

    describe("definePreferredPath", () => {
        it("Non existent Learning Unit specified -> NotFoundException", async () => {
            await expect(
                learningPathService.definePreferredPath(
                    { learningUnits: ["non existent unit ID"] },
                    "anyID",
                ),
            ).rejects.toThrow(NotFoundException);
        });

        it("Ordering defined -> LearningPath updated", async () => {
            // Create three learning units which can be shuffled
            const map = await dbUtils.createSkillMap("user1", "OrderedSkillMap");
            const skill1 = await dbUtils.createSkill(map, "Skill1");
            const skill2 = await dbUtils.createSkill(map, "Skill2");
            const skill3 = await dbUtils.createSkill(map, "Skill3");
            await dbUtils.createLearningUnit("unit 1", [skill1], []);
            await dbUtils.createLearningUnit("unit 2", [skill2], []);
            await dbUtils.createLearningUnit("unit 3", [skill3], [skill1, skill2]);
            const skill1Dto = SkillDto.createFromDao(skill1);
            const skill2Dto = SkillDto.createFromDao(skill2);
            const skill3Dto = SkillDto.createFromDao(skill3);

            // Pre-condition: Determine default path produced by the algorithm
            const path = await getPath({
                skills: [skill1Dto, skill2Dto, skill3Dto],
                learningUnits: await findAll(db),
                desiredSkills: [skill3Dto],
                ownedSkill: [],
                optimalSolution: true,
            });
            expect(path).not.toBeNull();

            // Test: Exchange first and second unit
            const unitOrdering = path!.path.map((unit) => unit.id);
            [unitOrdering[0], unitOrdering[1]] = [unitOrdering[1], unitOrdering[0]];
            const request: PreferredPathDto = { learningUnits: unitOrdering };
            await learningPathService.definePreferredPath(request, "anyID");

            // Post-condition: Check that the path is now different (according to spec of unitOrdering)
            const newPath = await getPath({
                skills: [skill1Dto, skill2Dto, skill3Dto],
                learningUnits: await findAll(db),
                desiredSkills: [skill3Dto],
                ownedSkill: [],
                optimalSolution: true,
            });
            expect(newPath).not.toBeNull();
            expect(newPath!.path.map((unit) => unit.id)).toEqual(unitOrdering);
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
