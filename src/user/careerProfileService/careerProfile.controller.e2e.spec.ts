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
