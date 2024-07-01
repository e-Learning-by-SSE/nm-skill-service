import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import { PrismaModule } from "../prisma/prisma.module";
import { DbTestUtils } from "../DbTestUtils";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { LearningUnitModule } from "./learningUnit.module";
import {
    SearchLearningUnitCreationDto,
    SearchLearningUnitDto,
    SearchLearningUnitListDto,
} from "./dto";

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
});
