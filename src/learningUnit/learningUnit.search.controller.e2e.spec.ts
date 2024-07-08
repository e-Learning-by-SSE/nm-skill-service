import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import { PrismaModule } from "../prisma/prisma.module";
import { DbTestUtils } from "../DbTestUtils";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { LearningUnitModule } from "./learningUnit.module";
import {
    LearningUnitFilterDto,
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitListDto,
} from "./dto";
import { LearningUnit, Skill, SkillMap } from "@prisma/client";

describe("Feedback Controller Tests", () => {
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
                LearningUnitModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    describe("GET:/learning-units/showAllLearningUnits", () => {
        it("No learning units -> 200; Empty list", async () => {
            // Act
            const response = await request(app.getHttpServer()).get(
                "/learning-units/showAllLearningUnits",
            );

            // Test: Empty response
            expect(response.status).toBe(200);
            const learningUnitList = response.body as SearchLearningUnitListDto;
            expect(learningUnitList.learningUnits).toEqual([]);
        });

        it("Existing learning units -> 200; Non-empty List", async () => {
            // Test data: Empty learning unit
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);

            // Act
            const response = await request(app.getHttpServer()).get(
                "/learning-units/showAllLearningUnits",
            );

            // expected result
            const expected = SearchLearningUnitDto.createFromDao(lu);
            // Delete undefined, optional properties
            delete expected.linkToHelpMaterial;

            // Test list with existing LU
            expect(response.status).toBe(200);
            const learningUnitList = response.body as SearchLearningUnitListDto;
            expect(learningUnitList.learningUnits).toHaveLength(1);
            expect(learningUnitList.learningUnits[0]).toMatchObject(expected);
        });
    });

    describe("POST:/", () => {
        it("Valid learning unit -> 201; Unit created", async () => {
            // Test data
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");

            // Precondition unit does not exist
            let nUnits = await dbUtils.getDb().learningUnit.count();
            expect(nUnits).toBe(0);

            // Act: Create a learning unit
            const creationDto: SearchLearningUnitCreationDto = {
                id: "1",
                requiredSkills: [],
                teachingGoals: [goal.id],
                targetAudience: ["Apprentice"],
            };
            const response = await request(app.getHttpServer())
                .post("/learning-units/")
                .send(creationDto);

            // Assert: Check response
            expect(response.status).toBe(201);
            const created = response.body as SearchLearningUnitDto;
            expect(created).toMatchObject(creationDto);
            nUnits = await dbUtils.getDb().learningUnit.count();
            expect(nUnits).toBe(1);
        });

        it("Invalid learning unit -> 400; Unit not created", async () => {
            // Test data: Invalid learning unit object
            const response = await request(app.getHttpServer()).post("/learning-units/").send({}); // Invalid learning unit object
            expect(response.status).toBe(400);
            const error = response.body as BadRequestException;
            expect(error.message).toEqual(`Invalid input data: {}`);
        });

        it("Learning unit with already existing ID -> 403; Unit not created", async () => {
            // Test data: Learning unit object with already existing ID
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);
            const creationDto: SearchLearningUnitCreationDto = {
                id: lu.id, // ID already in use
                requiredSkills: [],
                teachingGoals: [goal.id],
                targetAudience: ["Apprentice"],
            };

            const response = await request(app.getHttpServer())
                .post("/learning-units/")
                .send(creationDto);
            expect(response.status).toBe(403);
            const error = response.body as BadRequestException;
            expect(error.message).toEqual(`Learning unit with id \"${lu.id}\" already exists`);
        });
    });

    describe("GET:/learning-units/", () => {
        // Test data
        const owner1 = "Instructor-1";
        const owner2 = "Instructor-2";
        let skillMap: SkillMap;
        let [skill1, skill2, skill3, skill4]: Skill[] = [];
        let [unit1, unit2, unit3]: LearningUnit[] = [];

        beforeEach(async () => {
            // Test data
            skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            skill1 = await dbUtils.createSkill(skillMap, "Skill 1");
            skill2 = await dbUtils.createSkill(skillMap, "Skill 2");
            skill3 = await dbUtils.createSkill(skillMap, "Skill 3");
            skill4 = await dbUtils.createSkill(skillMap, "Skill 4");

            unit1 = await dbUtils.createLearningUnit([skill2], [skill1]);
            await dbUtils.getDb().learningUnit.update({
                where: { id: unit1.id },
                data: { orga_id: owner1 },
            });
            unit2 = await dbUtils.createLearningUnit([skill4], [skill2, skill3]);
            await dbUtils.getDb().learningUnit.update({
                where: { id: unit2.id },
                data: { orga_id: owner1 },
            });
            unit3 = await dbUtils.createLearningUnit([skill4], []);
            await dbUtils.getDb().learningUnit.update({
                where: { id: unit3.id },
                data: { orga_id: owner2 },
            });
        });

        /**
         * Auxillary function that converts a LearningUnit DAO to an expected DTO.
         * @param unit The unit which is expected as a return result.
         * @returns The expected return result to be used in expect().toMatchObject().
         */
        function convertToExpectedDto(unit: LearningUnit): SearchLearningUnitDto {
            const dto = SearchLearningUnitDto.createFromDao(unit);
            dto.updatedAt = expect.any(String);
            // Optional (unset) attributes
            delete dto.linkToHelpMaterial;

            if (unit.id === unit1.id || unit.id === unit2.id) {
                dto.orga_id = owner1;
            } else if (unit.id === unit3.id) {
                dto.orga_id = owner2;
            }

            return dto;
        }

        it("1 Owner; No Goals; No Requirements -> 200; Unit returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    owners: [owner1],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit1), convertToExpectedDto(unit2)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("Multiple Owners; No Goals; No Requirements -> 200; Unit returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    owners: [owner1, owner2],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [
                    convertToExpectedDto(unit1),
                    convertToExpectedDto(unit2),
                    convertToExpectedDto(unit3),
                ],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("Non-existing Owners; No Goals; No Requirements -> 200; Empty list", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    owners: ["Non-Existing"],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toEqual(expected);
        });

        it("No owners; 1 Goal; No Requirements -> 200; Units returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    teachingGoals: [skill4.id],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit2), convertToExpectedDto(unit3)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("No owners; Multiple Goals; No Requirements -> 200; Units returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    teachingGoals: [skill2.id, skill4.id],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [
                    convertToExpectedDto(unit1),
                    convertToExpectedDto(unit2),
                    convertToExpectedDto(unit3),
                ],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("No owners; Unused Goal; No Requirements -> 200; Empty list", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    teachingGoals: [skill1.id],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("No owners; No Goals; 1 Requirement -> 200; Unit returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    requiredSkills: [skill2.id],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit2)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("No owners; No Goals; Multiple Requirements -> 200; Units returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    requiredSkills: [skill1.id, skill3.id],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit1), convertToExpectedDto(unit2)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("No owners; No Goals; Empty Requirements -> 200; Unit returned", async () => {
            // Act
            const response = await request(app.getHttpServer()).get(`/learning-units/`).query({
                requiredSkills: "",
            });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit3)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });

        it("Multiple filter: owner + goal  -> 200; Intersection returned", async () => {
            // Act
            const response = await request(app.getHttpServer())
                .get(`/learning-units/`)
                .query({
                    teachingGoals: [skill4.id],
                    owners: [owner1],
                });

            const expected: SearchLearningUnitListDto = {
                learningUnits: [convertToExpectedDto(unit2)],
            };

            // Assert: Check response
            expect(response.status).toBe(200);
            const results = response.body as LearningUnitFilterDto;
            expect(results).toMatchObject(expected);
        });
    });

    describe("GET:/learning-units/{learningUnitId}", () => {
        it("Non-existing learning unit -> 404; Unit not found", async () => {
            // Test data: Non-existing ID
            const response = await request(app.getHttpServer()).get("/learning-units/1");
            expect(response.status).toBe(404);
            const error = response.body as BadRequestException;
            expect(error.message).toEqual("Specified LearningUnit not found: 1");
        });
    });
});
