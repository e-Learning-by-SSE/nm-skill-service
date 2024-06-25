import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../../DbTestUtils";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { validate } from "class-validator";
import { LearningPath, LearningUnit, Skill } from "@prisma/client";
import { PathFinderModule } from "../../pathFinder/pathFinder.module";
import { PathFinderService } from "../../pathFinder/pathFinder.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningUnitFactory } from "../../learningUnit/learningUnitFactory";
import { LearningHistoryService } from "./learningHistory.service";
import { PersonalizedPathDto } from "./dto";

describe("Learning History Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();

    // Auxillary
    const config = new ConfigService();
    const db = new PrismaService(config);
    const luFactory = new LearningUnitFactory(db);
    const historyService = new LearningHistoryService(db, luFactory);
    const pathFinderService = new PathFinderService(db, luFactory, historyService);

    // Test data
    const learnerId = "1";
    let [skill1, skill2]: Skill[] = [];
    let [unit1, unit2]: LearningUnit[] = [];
    let [path1, path2]: LearningPath[] = [];

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
                UserModule,
                PathFinderModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        await dbUtils.wipeDb();

        await dbUtils.createUserProfile(learnerId);
        const instructor = "Teacher-1";
        const skillMap = await dbUtils.createSkillMap(instructor, "A Map");
        skill1 = await dbUtils.createSkill(skillMap, "Skill-1");
        skill2 = await dbUtils.createSkill(skillMap, "Skill-2");
        unit1 = await dbUtils.createLearningUnit([skill1], []);
        unit2 = await dbUtils.createLearningUnit([skill2], [skill1]);
        path1 = await dbUtils.createLearningPath(instructor, [skill1, skill2]);
        path2 = await dbUtils.createLearningPath(instructor, [skill1]);
    });

    describe("GET:learning-history/{history_id}/learned-skills", () => {
        it("Empty profile -> 200", async () => {
            const response = await request(app.getHttpServer())
                .get(`/learning-history/${learnerId}/learned-skills`)
                .expect(200);

            expect(response.body).toBeDefined();
            const responseDto = response.body as string[];
            expect(responseDto).toEqual([]);
        });
    });

    describe("GET:/personalized-paths/{path_id}", () => {
        it("Existing path -> 200", async () => {
            // Enroll into the path
            const enrollment = (await pathFinderService.enrollment(
                learnerId,
                path1.id,
            )) as PersonalizedPathDto;

            await request(app.getHttpServer())
                .get(`/personalized-paths/${enrollment.personalizedPathId}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as PersonalizedPathDto;
                    expect(result).toMatchObject(enrollment);
                    expect(result.learningUnitInstances).toHaveLength(2);
                    expect(result.learningUnitInstances[0].unitId).toBe(unit1.id);
                    expect(result.learningUnitInstances[1].unitId).toBe(unit2.id);
                });
        });

        it("Existing path (when more than one exist) -> 200", async () => {
            // Enroll into the path
            const enrollment1 = (await pathFinderService.enrollment(
                learnerId,
                path1.id,
            )) as PersonalizedPathDto;
            await pathFinderService.enrollment(learnerId, path2.id);

            await request(app.getHttpServer())
                .get(`/personalized-paths/${enrollment1.personalizedPathId}`)
                .expect(200)
                .expect((res) => {
                    const result = res.body as PersonalizedPathDto;
                    expect(result).toMatchObject(enrollment1);
                    expect(result.learningUnitInstances).toHaveLength(2);
                    expect(result.learningUnitInstances[0].unitId).toBe(unit1.id);
                    expect(result.learningUnitInstances[1].unitId).toBe(unit2.id);
                });
        });
    });
});
