import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { LearningUnitFactory } from "./learningUnitFactory";
import {
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitListDto,
    SearchLearningUnitUpdateDto,
} from "./dto";
import { LIFECYCLE, Skill, SkillMap } from "@prisma/client";
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
                factory.loadAllLearningUnits({ where: { id: "Awesome Id" } }),
            ).resolves.toEqual({
                learningUnits: [],
            });
        });

        it("With Parameter -> Only exact match should return", async () => {
            const creationDtoMatch = SearchLearningUnitCreationDto.createForTesting({
                id: "1",
            });
            const creationDtoNoMatch = SearchLearningUnitCreationDto.createForTesting({
                id: "2",
            });
            await factory.createLearningUnit(creationDtoMatch);
            await factory.createLearningUnit(creationDtoNoMatch);

            // Should return only the first object
            const result = await factory.loadAllLearningUnits({
                where: { id: "1" },
            });

            // Expected DTO class and values for one and only element
            const expectedItem: Partial<SearchLearningUnitDto> = {
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
                id: "Awesome Id",
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                id: creationDto.id,
                requiredSkills: [],
                teachingGoals: [],
            };
            expect(result).toMatchObject(expected);

            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Required Skill -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                id: "Awesome id",
                requiredSkills: [reqSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                id: creationDto.id,
                requiredSkills: creationDto.requiredSkills,
                teachingGoals: [],
            };
            expect(result).toMatchObject(expected);
            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Taught Skill -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                id: "Awesome Id",
                requiredSkills: [reqSkill.id],
                teachingGoals: [goalSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                id: creationDto.id,
                requiredSkills: creationDto.requiredSkills,
                teachingGoals: creationDto.teachingGoals,
            };
            expect(result).toMatchObject(expected);
            // Test that it is actually a SearchLearningUnitDto, by testing for the existence of search-specific mandatory properties
            expect(result).toHaveProperty("id");
        });

        it("Empty DB, Required/Taught Skills -> Create Learning Unit", async () => {
            const creationDto = SearchLearningUnitCreationDto.createForTesting({
                id: "Awesome id",
                teachingGoals: [goalSkill.id],
            });
            const result = await factory.createLearningUnit(creationDto);

            // Expected DTO class and values
            const expected: Partial<SearchLearningUnitDto> = {
                id: creationDto.id,
                requiredSkills: [],
                teachingGoals: creationDto.teachingGoals,
            };
            expect(result).toMatchObject(expected);

            expect(result).toHaveProperty("id");
        });
    });

    describe("patchLearningUnit - Partial Updates", () => {
        let unit: SearchLearningUnitDto;
        let [skill1, skill2, skill3]: Skill[] = [];

        beforeEach(async () => {
            // Wipe DB before test
            await dbUtils.wipeDb();

            // Create skills
            const skillMap = await dbUtils.createSkillMap(
                "owner",
                "Skill Map for testing partial updates of LearningUnits",
            );
            skill1 = await dbUtils.createSkill(skillMap, "Skill1", [], "Description", 1);
            skill2 = await dbUtils.createSkill(skillMap, "Skill2", [], "Description", 1);
            skill3 = await dbUtils.createSkill(skillMap, "Skill3", [], "Description", 1);

            // Create empty learning unit
            const creationDto: SearchLearningUnitCreationDto = {
                id: "unitID-1",
                requiredSkills: [skill1.id],
                teachingGoals: [skill2.id],
                targetAudience: [],
                lifecycle: LIFECYCLE.DRAFT,
                language: "en",
            };
            unit = await factory.createLearningUnit(creationDto);

            expect(unit, "patchLearningUnit::beforeEach broken").toMatchObject(creationDto);
            // Prepare expected object:
            // - updatedAt is expected to be updated with irrelevant/unknown time
            unit.updatedAt = expect.any(String);
        });

        it("Required Skills", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                requiredSkills: [skill3.id],
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                requiredSkills: updateDto.requiredSkills!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Teaching Goals", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                teachingGoals: [skill3.id],
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                teachingGoals: updateDto.teachingGoals!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Target Audience", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                targetAudience: ["Student"],
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                targetAudience: updateDto.targetAudience!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Content Creator", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                contentCreator: "A Creator",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                contentCreator: updateDto.contentCreator!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Content Provider", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                contentProvider: "A Provider",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                contentProvider: updateDto.contentProvider!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Content Tags", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                contentTags: ["Tag1", "Tag2"],
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                contentTags: updateDto.contentTags!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Context Tags", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                contextTags: ["Tag1", "Tag2"],
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                contextTags: updateDto.contextTags!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Semantic Density", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                semanticDensity: "High",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                semanticDensity: updateDto.semanticDensity!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Semantic Gravity", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                semanticGravity: "High",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                semanticGravity: updateDto.semanticGravity!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Language", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                language: "de",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                language: updateDto.language!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Lifecycle", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                lifecycle: LIFECYCLE.POOL,
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                lifecycle: updateDto.lifecycle!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Link To Help Material", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                linkToHelpMaterial: "A Link to nowhere",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                linkToHelpMaterial: updateDto.linkToHelpMaterial!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Rating", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                rating: "Awesome",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                rating: updateDto.rating!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Processing Time", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                processingTime: "42 minutes",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                processingTime: updateDto.processingTime!,
            };
            expect(updatedUnit).toMatchObject(expected);
        });

        it("Orga ID", async () => {
            // Act
            const updateDto: SearchLearningUnitUpdateDto = {
                id: unit.id,
                orga_id: "A very new organization",
            };
            const updatedUnit = await factory.patchLearningUnit(updateDto);

            const expected: SearchLearningUnitDto = {
                ...unit,
                orga_id: updateDto.orga_id!,
            };
            expect(updatedUnit).toMatchObject(expected);
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
                targetAudience: [],
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
                targetAudience: [],
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
            await expect(factory.deleteLearningUnit("1234s")).rejects.toThrowError(
                NotFoundException,
            );
        });
    });
});
