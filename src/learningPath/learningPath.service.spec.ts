import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { LearningPathMgmtService } from "./learningPath.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import {
    LearningPathCreationDto,
    LearningPathDto,
    PathGoalCreationDto,
    PathGoalDto,
    PreferredPathDto,
} from "./dto";
import { LearningUnit, getPath } from "../../nm-skill-lib/src";
import { SkillDto } from "../skills/dto";

describe("LearningPath Service", () => {
    // Auxillary objects
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const learningPathService = new LearningPathMgmtService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("loadAllLearningPaths", () => {
        it("Empty DB -> Empty Result List", async () => {
            await expect(learningPathService.loadAllLearningPaths()).resolves.toEqual({
                learningPaths: [],
            });
        });

        it("One Path definition -> One result", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    title: "Test",
                },
            });

            // Test: Exactly one element with specified title found
            await expect(learningPathService.loadAllLearningPaths()).resolves.toMatchObject({
                learningPaths: [expect.objectContaining({ title: creationResult.title })],
            });
        });

        it("Select by Title -> Not all elements returned", async () => {
            // Precondition: 2 elements exist (do not rely on Service for its creation)
            const creationResult1 = await db.learningPath.create({
                data: {
                    title: "Test",
                },
            });
            await db.learningPath.create({
                data: {
                    title: "Test2",
                },
            });

            // Test: Only first element found
            await expect(
                learningPathService.loadAllLearningPaths({
                    where: { title: creationResult1.title },
                }),
            ).resolves.toMatchObject({
                learningPaths: [expect.objectContaining({ title: creationResult1.title })],
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
                    title: "Test",
                },
            });

            const expectedResult: Partial<LearningPathDto> = {
                id: creationResult.id,
                title: creationResult.title,
            };
            await expect(
                learningPathService.getLearningPath(creationResult.id),
            ).resolves.toMatchObject(expect.objectContaining(expectedResult));
        });

        it("Wrong ID -> Error", async () => {
            // Precondition: 1 element exist (do not rely on Service for its creation)
            const creationResult = await db.learningPath.create({
                data: {
                    title: "Test",
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
            const creationDto: LearningPathCreationDto = {
                title: "Test",
                goals: [],
            };

            // Pre-Condition: Expected element does not exist
            await expect(
                learningPathService.loadAllLearningPaths({ where: { title: creationDto.title } }),
            ).resolves.toMatchObject({
                learningPaths: [],
            });

            // Post-Condition: Element was created and DTO is returned
            const expected: Partial<LearningPathDto> = {
                id: expect.anything(),
                title: creationDto.title,
                goals: [],
            };
            await expect(
                learningPathService.createLearningPath(creationDto),
            ).resolves.toMatchObject(expect.objectContaining(expected));
        });

        it("Duplicate Title -> Error", async () => {
            // Data to be created
            const creationDto: LearningPathCreationDto = {
                title: "Test",
                goals: [],
            };

            // Pre-Condition: Element with specified title already exists
            await db.learningPath.create({
                data: {
                    title: creationDto.title,
                },
            });

            // Post-Condition: No element created -> Error thrown
            await expect(learningPathService.createLearningPath(creationDto)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });

    it("Create Path including a Goal-Spec -> LearningPath created", async () => {
        // Data to be created
        const goal1 = new PathGoalCreationDto("Test Goal", null, "Test Description", [], []);

        const creationDto: LearningPathCreationDto = {
            title: "Test",
            goals: [goal1],
        };

        // Pre-Condition: Expected element does not exist
        await expect(
            learningPathService.loadAllLearningPaths({ where: { title: creationDto.title } }),
        ).resolves.toMatchObject({
            learningPaths: [],
        });

        // Post-Condition: Element was created and DTO is returned
        const expectedGoal: Partial<PathGoalDto> = {
            title: goal1.title,
            description: goal1.description,
        };
        const expected: Partial<LearningPathDto> = {
            id: expect.anything(),
            title: creationDto.title,
            goals: [expect.objectContaining(expectedGoal)],
        };
        await expect(learningPathService.createLearningPath(creationDto)).resolves.toMatchObject(
            expected,
        );
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
        // findAll_internal(db).then((lus) =>
        //     lus
        //         .map((lu) => ({
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
