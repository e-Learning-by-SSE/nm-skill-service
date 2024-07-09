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

    describe("GET:/berufeNet/getJobById", () => {
        it("Valid ID of JobBySearchString -> 200 (same entry)", async () => {
            // Identify a JobId
            let response = await request(app.getHttpServer())
                .get("/berufeNet/getJobBySearchString")
                .query({ searchString: "Softwareentwickler" });

            const developerEntry = (response.body as JobResponseDto[]).filter(
                (entry) => entry.kurzBezeichnungNeutral === "Softwareentwickler/in",
            )[0];
            const developerId = developerEntry.id;

            console.log("Developer ID: " + developerId);

            // Act: Query for a job
            response = await request(app.getHttpServer())
                .get("/berufeNet/getJobById")
                .query({ JobBerufId: developerId });

            // Assert: Positive response, queried job should be in the response
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBeGreaterThanOrEqual(1);
            // All entries belong to the same job, but may have different IDs
            for (const job of response.body) {
                expect(job).toHaveProperty("kurzBezeichnungNeutral", "Softwareentwickler/in");
            }
            // The specified ID should be in the response
            const ids = response.body.map((job: { id: number }) => job.id);
            expect(ids).toContain(developerId);
        });
    });
});
