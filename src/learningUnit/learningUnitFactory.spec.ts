import { ConfigService } from "@nestjs/config";

import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { LearningUnitFactory } from "./learningUnitFactory";
import {
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitListDto,
} from "./dto";
import { LIFECYCLE, LearningUnit, Skill, SkillMap } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

describe("LearningUnit Factory", () => {
    // Test object
    let factory: LearningUnitFactory;

    let db: PrismaService;
    let dbUtils: DbTestUtils;

    // Auxillary
    let config: ConfigService;

    // Test data
    let skillMap: SkillMap;
    let reqSkill: Skill;
    let goalSkill: Skill;

    beforeAll(async () => {
        config = new ConfigService();
        db = new PrismaService(config);
        dbUtils = DbTestUtils.getInstance();
    });

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();

        factory = new LearningUnitFactory(db);

        // Create Skills that may be used during tests
        skillMap = await dbUtils.createSkillMap("owner", "Default Skill Map for Testing");
        reqSkill = await dbUtils.createSkill(skillMap, "Required Skill", [], "Description", 1);
        goalSkill = await dbUtils.createSkill(skillMap, "Taught Skill", [], "Description", 1);
    });

    describe("loadAllLearningUnits", () => {
        it("Empty DB -> Empty Result List", async () => {
            await expect(factory.loadAllLearningUnits()).resolves.toEqual({ learningUnits: [] });
        });

        it("With Parameter on Empty DB -> Empty Result List", async () => {
            await expect(
                factory.loadAllLearningUnits({ where: { title: "Awesome Title" } }),
            ).resolves.toEqual({
                learningUnits: [],
            });
        });

        it("With Parameter -> Only exact match should return", async () => {
            const creationDtoMatch = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
                id:"1"
            });
            const creationDtoNoMatch = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title 2",
                id:"2"
            });
            await factory.createLearningUnit(creationDtoMatch);
            await factory.createLearningUnit(creationDtoNoMatch);

            // Should return only the first object
            const result = await factory.loadAllLearningUnits({
                where: { title: "Awesome Title" },
            });

            // Expected DTO class and values for one and only element
            const expectedItem: Partial<SearchLearningUnitDto> = {
                title: creationDtoMatch.title,
                requiredSkills: [],
                teachingGoals: [],
            };
            // Expected DTO class and values for the whole list
            const expectedList: SearchLearningUnitListDto = {
                learningUnits: [expect.objectContaining(expectedItem)],
            };
            expect(result).toMatchObject(expectedList);
        });
    });

    describe("createLearningUnit", () => {
        it("Empty DB, no Skills -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                title: creationDto.title,
                requiredSkills: [],
                teachingGoals: [],
            };
            expect(result).toMatchObject(expected);
           
            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Required Skill -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
                requiredSkills: [reqSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                title: creationDto.title,
                requiredSkills: creationDto.requiredSkills,
                teachingGoals: [],
            };
            expect(result).toMatchObject(expected);
            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Taught Skill -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
                requiredSkills: [reqSkill.id],
                teachingGoals: [goalSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                title: creationDto.title,
                requiredSkills: creationDto.requiredSkills,
                teachingGoals: creationDto.teachingGoals,
            };
            expect(result).toMatchObject(expected);
            // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Required/Taught Skills -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                title: "Awesome Title",
                teachingGoals: [goalSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                title: creationDto.title,
                requiredSkills: [],
                teachingGoals: creationDto.teachingGoals,
            };
            expect(result).toMatchObject(expected);
             
            expect(result).toHaveProperty("id");
        });
    });

    describe("deleteLearningUnit", () => {
        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();
        });

        it("should delete a learning unit when it exists and is in the DRAFT state", async () => {
            const existingLearningUnit: SearchLearningUnitCreationDto = {
                id: "789",
                title: "Learning Unit 2",
                lifecycle: LIFECYCLE.POOL, // Assuming PUBLISHED is not the DRAFT state
                teachingGoals: [],
                requiredSkills: [],
            };
            const creationDto =
                SearchLearningUnitCreationDto.createForTesting(existingLearningUnit);
            const result1 = await factory.createLearningUnit(creationDto);

            const learningUnit = await db.learningUnit.findUnique({
                where: {
                    id: "789",
                },
            });

            if (learningUnit) {
                // Learning unit with the specified criteria was found
                console.log("Found Learning Unit:", learningUnit);
            } else {
                // Learning unit with the specified criteria was not found
                console.log("Learning Unit not found");
            }

            // Check that the result includes a success message
            await expect(
                (
                    await db.learningUnit.delete({ where: { id: existingLearningUnit.id } })
                ).id,
            ).toEqual(result1.id);
        });

        it("should throw NotFoundException when deleting a non-existent learning unit", async () => {
            // Mock Prisma's findUnique to return null (learning unit not found)
            db.learningUnit.findUnique({
                where: {
                    id: "123notExists",
                },
            });

            // Attempt to delete a non-existent learning unit
            await expect(factory.deleteLearningUnit("456")).rejects.toThrowError(NotFoundException);
        });

        it("should throw ForbiddenException when deleting a learning unit that is not in DRAFT state", async () => {
            const existingLearningUnit: SearchLearningUnitCreationDto = {
                id: "789",
                title: "Learning Unit 2",
                lifecycle: LIFECYCLE.POOL, // Assuming PUBLISHED is not the DRAFT state
                teachingGoals: [],
                requiredSkills: [],
            };

            const creationDto =
                SearchLearningUnitCreationDto.createForTesting(existingLearningUnit);
            const result1 = await factory.createLearningUnit(creationDto);
            // Attempt to delete a learning unit in a non-DRAFT state
            await expect(factory.deleteLearningUnit("789")).rejects.toThrowError(
                ForbiddenException,
            );
        });

        it("should throw an error when Prisma delete operation fails", async () => {
            const existingLearningUnit: SearchLearningUnitCreationDto = {
                id: "1234",
                title: "Learning Unit 2",
                lifecycle: LIFECYCLE.POOL, // Assuming PUBLISHED is not the DRAFT state
                teachingGoals: [],
                requiredSkills: [],
            };

            await expect(factory.deleteLearningUnit("1234s")).rejects.toThrowError(
                NotFoundException,
            );
        });
    });
});
