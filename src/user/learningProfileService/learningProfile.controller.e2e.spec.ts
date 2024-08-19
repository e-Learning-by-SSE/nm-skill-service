import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../../DbTestUtils";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { validate } from "class-validator";
import { LearningProfileDto } from "./dto";

describe("Learning-Profile Controller Tests", () => {
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

    afterAll(async () => {
        await dbUtils.wipeDb();
        await app.close();
    });

    describe("GET:/learning-profiles/{learning_profile_id}", () => {
        it("Existent learning profile -> 200", async () => {
            //Test user with test learning profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Act by sending a get request
            const response = await request(app.getHttpServer())
                .get(`/learning-profiles/${userId}`)
                .expect(200);

            //Assert that the learning profile is returned
            expect(response.body).toBeDefined();
            const responseDto: LearningProfileDto = response.body;
            expect(responseDto.id).toBe(userId);
        });

        it("Non-existent learning profile -> 403", async () => {
            //Act by sending a get request
            await request(app.getHttpServer()).get(`/learning-profiles/1`).expect(403);
        });
    });

    describe("PATCH:/learning-profiles/{learning_profile_id}", () => {
        it("Update values -> 200", async () => {
            //Test user with test learning profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Act by sending a patch request
            const response = await request(app.getHttpServer())
                .patch(`/learning-profiles/${userId}`)
                .send({
                    semanticDensity: 0.5,
                    semanticGravity: 0.5,
                    mediaType: ["text"],
                })
                .expect(200);

            //Assert that the learning profile was updated
            expect(response.body).toBeDefined();
            expect(response.text).toBe("Success!");

            //Send get request to check if the values were updated
            const responseGet = await request(app.getHttpServer())
                .get(`/learning-profiles/${userId}`)
                .expect(200);

            //Assert that the values were updated
            const responseDto: LearningProfileDto = responseGet.body;
            expect(responseDto.id).toBe(userId);
            expect(responseDto.semanticDensity).toBe(0.5);
            expect(responseDto.semanticGravity).toBe(0.5);
            expect(responseDto.mediaType).toEqual(["text"]);
        });

        it("Invalid values -> 403", async () => {
            //Test user with test learning profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Act by sending a patch request
            await request(app.getHttpServer())
                .patch(`/learning-profiles/${userId}`)
                .send({
                    semanticDensity: 2,
                    semanticGravity: 0.5,
                    mediaType: "text",
                })
                .expect(403);
        });

        it("Non-existent learning profile -> 403", async () => {
            //Act by sending a patch request
            await request(app.getHttpServer())
                .patch(`/learning-profiles/nonExistent`)
                .send({
                    semanticDensity: 0.5,
                    semanticGravity: 0.5,
                    mediaType: "text",
                })
                .expect(403);
        });
    });
});
