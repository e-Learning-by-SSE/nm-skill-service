import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import { PrismaModule } from "../prisma/prisma.module";
import { DbTestUtils } from "../DbTestUtils";
import { INestApplication } from "@nestjs/common";
import { LearningUnitModule } from "./learningUnit.module";
import { SearchLearningUnitDto, SearchLearningUnitListDto } from "./dto";

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
});
