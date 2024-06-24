import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../../DbTestUtils";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { validate } from "class-validator";

describe("LEarning History Controller Tests", () => {
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

    describe("GET:learning-history/{history_id}/learned-skills", () => {
        it("Empty profile -> 200", async () => {
            const userId = "1";
            dbUtils.createUserProfile(userId);

            const response = await request(app.getHttpServer())
                .get(`/learning-history/${userId}/learned-skills`)
                .expect(200);

            expect(response.body).toBeDefined();
            const responseDto = response.body as string[];
            expect(responseDto).toEqual([]);
        });
    });
});
