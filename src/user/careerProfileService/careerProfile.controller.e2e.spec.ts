import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../../DbTestUtils";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { validate } from "class-validator";
import { CareerProfileDto } from "./dto/careerProfile.dto";

describe("Career-Profile Controller Tests", () => {
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
                UserModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    describe("GET:/career-profiles", () => {
        it("Empty database -> 200", async () => {
            // Act
            const response = await request(app.getHttpServer()).get("/career-profiles");

            // Assert: Empty result
            expect(response.status).toBe(200);
            const responseDto = response.body as CareerProfileDto[];
            expect(responseDto).toEqual([]);
        });

        it("Multiple (empty) profiles -> 200; All profiles", async () => {
            // Test data
            const profile1 = await dbUtils.createUserProfile("1");
            const profile2 = await dbUtils.createUserProfile("2");

            // Act
            const response = await request(app.getHttpServer()).get("/career-profiles");

            // Assert: Both profiles returned
            const expected: CareerProfileDto[] = [
                {
                    id: profile1.id,
                    jobHistory: [],
                    professionalInterests: [],
                    qualifications: [],
                    selfReportedSkills: [],
                },
                {
                    id: profile2.id,
                    jobHistory: [],
                    professionalInterests: [],
                    qualifications: [],
                    selfReportedSkills: [],
                },
            ];
            expect(response.status).toBe(200);
            const responseDto = response.body as CareerProfileDto[];
            expect(responseDto).toMatchObject(expected);
        });
    });

    describe("GET:/career-profiles/{career_profile_id}", () => {
        it("Existent user -> 200", async () => {
            const userId = "1";
            await dbUtils.createUserProfile(userId);

            const response = await request(app.getHttpServer())
                .get(`/career-profiles/${userId}`)
                .expect(200);

            expect(response.body).toBeDefined();
            const responseDto = response.body as CareerProfileDto;
            expect(responseDto.id).toBe(userId);
        });
    });
});
