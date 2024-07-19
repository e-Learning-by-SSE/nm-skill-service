import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaModule } from "../prisma/prisma.module";
import { UserCreationDto } from "./dto";
import { UserModule } from "./user.module";

describe("User controller tests", () => {
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

    describe("GET:/user-profiles/{user_profile_id}", () => {
        it("Non-existing user -> 404", async () => {
            // Arrange: Non-existing user
            const userId = "1";

            // Act
            const response = await request(app.getHttpServer()).get("/user-profiles/${userId}");

            // Assert: Empty result
            expect(response.status).toBe(404);
            expect(response.text).toEqual("{\"statusCode\":404,\"message\":\"Specified user not found: ${userId}\",\"error\":\"Not Found\"}");
        });

        it("Existing user-> 200", async () => {
            //Arrange: Existing user
            const userId = "1";
            await dbUtils.createUserProfile(userId);

            //Act: Send get request for existing user
            const response = await request(app.getHttpServer()).get(`/user-profiles/${userId}`).expect(200);

            //Assert: Expect to get the requested user
            expect(response.body).toBeDefined();
            const responseDto = response.body as UserCreationDto;
            expect(responseDto.id).toBe(userId);
        });
    });
});
