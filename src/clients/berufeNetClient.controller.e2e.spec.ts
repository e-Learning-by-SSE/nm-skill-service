import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { ClientModule } from "./client.module";
import { validate } from "class-validator";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../DbTestUtils";
import { JobResponseDto } from "./schemas";

describe("BerufeNet-Client E2E-Tests", () => {
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
                ClientModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("GET:/berufeNet/getJobBySearchString", () => {
        it("Valid String -> 200", async () => {
            // Act: Query for a job
            const response = await request(app.getHttpServer())
                .get("/berufeNet/getJobBySearchString")
                .query({ searchString: "Softwareentwickler" });

            // Assert: Positive response, queried job should be in the response
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            const result = response.body as JobResponseDto[];
            expect(result.length).toBeGreaterThan(0);
            const jobs = result.map((job) => job.kurzBezeichnungNeutral);
            expect(jobs).toContain("Softwareentwickler/in");
        });

        it("Invalid String -> 200 (empty result)", async () => {
            // Act: Query for a job
            const response = await request(app.getHttpServer())
                .get("/berufeNet/getJobBySearchString")
                .query({ searchString: "kgfgfsdf" });

            // Assert: Positive response, queried job should be in the response
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            const result = response.body as JobResponseDto[];
            expect(result.length).toBe(0);
        });
    });
});
