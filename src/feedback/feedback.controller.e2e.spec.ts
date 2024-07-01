import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";
import { PrismaModule } from "../prisma/prisma.module";
import { DbTestUtils } from "../DbTestUtils";
import { BadRequestException, INestApplication, NotFoundException } from "@nestjs/common";
import { FeedbackModule } from "./feedback.module";
import { FeedbackService } from "./feedback.service";
import { FeedbackDto } from "./dto";

describe("Feedback Controller Tests", () => {
    let app: INestApplication;
    const dbUtils = DbTestUtils.getInstance();
    const feedbackService = new FeedbackService(dbUtils.getDb());

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
                FeedbackModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    describe("GET:/learning-units/{learningUnitId}/feedbacks", () => {
        it("Non-existent learning unit -> 200; Empty list", async () => {
            const response = await request(app.getHttpServer()).get(
                "/learning-units/non-existing-id/feedbacks/",
            );
            expect(response.status).toBe(200);
            const feedbackList = response.body as FeedbackDto[];
            expect(feedbackList).toEqual([]);
        });

        it("Existent learning unit; No feedback -> 200; Empty list", async () => {
            // Test data: Empty learning unit
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);

            const response = await request(app.getHttpServer()).get(
                `/learning-units/${lu.id}/feedbacks/`,
            );
            expect(response.status).toBe(200);
            const feedbackList = response.body as FeedbackDto[];
            expect(feedbackList).toEqual([]);
        });

        it("Existent learning unit; With feedback -> 200; Non-empty list", async () => {
            // Test data: Learning unit with feedback
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);
            const feedback = await feedbackService.createFeedback({
                comprehensiveness: 1,
                learningUnitID: lu.id,
                learningValue: 2,
                overallRating: 3,
                presentation: 4,
                structure: 5,
                userID: "test",
            });

            const response = await request(app.getHttpServer()).get(
                `/learning-units/${lu.id}/feedbacks/`,
            );
            expect(response.status).toBe(200);
            const feedbackList = response.body as FeedbackDto[];
            expect(feedbackList.length).toBe(1);
            expect(feedbackList[0]).toMatchObject(feedback);
        });
    });

    describe("GET:/feedbacks/{feedbackId}", () => {
        it("Non-existent feedback -> 404", async () => {
            const response = await request(app.getHttpServer()).get("/feedbacks/non-existing-id");
            expect(response.status).toBe(404);
        });

        it("Existent feedback -> 200; Feedback object", async () => {
            // Test data: Feedback object
            const user = await dbUtils.createUserProfile("testUser");
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);
            const feedback = await feedbackService.createFeedback({
                comprehensiveness: 1,
                learningUnitID: lu.id,
                learningValue: 2,
                overallRating: 3,
                presentation: 4,
                structure: 5,
                userID: user.id,
            });

            const response = await request(app.getHttpServer()).get(
                `/feedbacks/${feedback.feedbackID}`,
            );
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(feedback);
        });
    });

    describe("DELETE:/feedbacks/{feedbackId}", () => {
        it("Non-existent feedback -> 404", async () => {
            const response = await request(app.getHttpServer()).delete(
                "/feedbacks/non-existing-id",
            );
            expect(response.status).toBe(404);
        });

        it("Existent feedback -> 200; Deleted feedback", async () => {
            // Test data: Feedback object
            const user = await dbUtils.createUserProfile("testUser");
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);
            const feedback = await feedbackService.createFeedback({
                comprehensiveness: 1,
                learningUnitID: lu.id,
                learningValue: 2,
                overallRating: 3,
                presentation: 4,
                structure: 5,
                userID: user.id,
            });

            const response = await request(app.getHttpServer()).delete(
                `/feedbacks/${feedback.feedbackID}`,
            );
            expect(response.status).toBe(200);
            const feedbackFromResponse = response.body as FeedbackDto;
            expect(feedbackFromResponse).toMatchObject(feedback);

            // Check if feedback was deleted
            const response2 = await request(app.getHttpServer()).get(
                `/feedbacks/${feedback.feedbackID}`,
            );
            expect(response2.status).toBe(404);
        });
    });

    describe("POST:/feedbacks", () => {
        it("Valid feedback -> 201; Created feedback", async () => {
            // Test data: Feedback object
            const user = await dbUtils.createUserProfile("testUser");
            const skillMap = await dbUtils.createSkillMap("An owner", "A Skill-Map");
            const goal = await dbUtils.createSkill(skillMap, "A Skill");
            const lu = await dbUtils.createLearningUnit([goal], []);
            const feedbackDto = {
                comprehensiveness: 1,
                learningUnitID: lu.id,
                learningValue: 2,
                overallRating: 3,
                presentation: 4,
                structure: 5,
                userID: user.id,
            };

            const response = await request(app.getHttpServer())
                .post("/feedbacks")
                .send(feedbackDto);
            expect(response.status).toBe(201);
            const feedbackFromResponse = response.body as FeedbackDto;
            expect(feedbackFromResponse).toMatchObject(feedbackDto);
        });

        it("Invalid feedback -> 400", async () => {
            // Test data: Invalid feedback object
            const response = await request(app.getHttpServer()).post("/feedbacks").send({}); // Invalid feedback object
            expect(response.status).toBe(400);
            const error = response.body as BadRequestException;
            expect(error.message).toContain("Invalid input data");
        });

        it("Feedback for non-existent learning unit -> 404", async () => {
            // Test data: Feedback object for non-existent learning unit
            const user = await dbUtils.createUserProfile("testUser");
            const feedbackDto = {
                comprehensiveness: 1,
                learningUnitID: "non-existing-id",
                learningValue: 2,
                overallRating: 3,
                presentation: 4,
                structure: 5,
                userID: user.id,
            };

            const response = await request(app.getHttpServer())
                .post("/feedbacks")
                .send(feedbackDto);
            expect(response.status).toBe(404);
            const error = response.body as NotFoundException;
            expect(error.message).toEqual(
                `No learning unit \"${feedbackDto.learningUnitID}\" found.`,
            );
        });
    });
});
