import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DbTestUtils } from "../../DbTestUtils";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { validate } from "class-validator";
import { CareerProfileDto, CareerProfileUpdateDto } from "./dto";

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

    afterAll(async () => {
        await dbUtils.wipeDb();
        await app.close();
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

    describe("PATCH:/career-profiles/{career_profile_id}", () => {
        it("Update values -> 200", async () => {
            //Test user with test career profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Values to be updated to
            const input: CareerProfileUpdateDto = {
                professionalInterests: ["Reading"],
                selfReportedSkills: ["Listening", "Breathing"],
            };

            //Act by sending the updated values as a patch request
            const response = await request(app.getHttpServer())
                .patch(`/career-profiles/${userId}`)
                .send(input)
                .expect(200);

            //Assert that the updated values are returned
            expect(response.body).toBeDefined();
            const responseDto = response.body;
            expect(responseDto.userId).toBe(userId);
            expect(responseDto.professionalInterests).toEqual(input.professionalInterests);
            expect(responseDto.selfReportedSkills).toEqual(input.selfReportedSkills);
        });
    });

    describe("POST:/career-profiles/{career_profile_id}/job_history", () => {
        it("Add job -> 201", async () => {
            //Test user with test career profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Values to be posted
            const input = {
                jobTitle: "Lead Breather",
                startDate: new Date("2021-01-01T00:00:00Z"),
                company: "Sleeping Inc.",
            };

            //Act by sending the new values as post request
            const response = await request(app.getHttpServer())
                .post(`/career-profiles/${userId}/job_history`)
                .send(input)
                .expect(201);

            //Assert that the new values are returned
            expect(response.text).toEqual(
                "Successfully added job to job history of user with id: " + userId,
            );
        });
    });

    describe("PATCH:/career-profiles/{career_profile_id}/job_history and DELETE", () => {
        it("Update and delete job -> 200", async () => {
            //Test user with test career profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Values to be created
            const postInput = {
                jobTitle: "Lead Breather",
                startDate: new Date("2021-01-01T00:00:00Z"),
                company: "Sleeping Inc.",
            };
            //Values to be updated to
            const updateInput = {
                jobTitle: "Lead Breather",
                startDate: new Date("2021-01-01T00:00:00Z"),
                endDate: new Date("2022-01-01T00:00:00Z"),
                company: "Sleeping Inc.",
            };

            //Act by sending the new values as post request
            await request(app.getHttpServer())
                .post(`/career-profiles/${userId}/job_history`)
                .send(postInput)
                .expect(201);

            //Receive the id of the created job
            const careerProfile = await request(app.getHttpServer())
                .get(`/career-profiles/${userId}`)
                .expect(200);
            const jobId = careerProfile.body.jobHistory[0].id;

            //Act by sending the updated values as a patch request
            const response = await request(app.getHttpServer())
                .patch(`/job_history/${jobId}`)
                .send(updateInput)
                .expect(200);

            //Assert that the request was successful
            expect(response.text).toEqual("Successfully updated job in job history");
            //Assert that the values were updated
            const updatedJob = await request(app.getHttpServer())
                .get(`/career-profiles/${userId}`)
                .expect(200);
            expect(new Date(updatedJob.body.jobHistory[0].endDate)).toEqual(updateInput.endDate);

            //Act by sending a delete request
            const responseDelete = await request(app.getHttpServer())
                .delete(`/job_history/${jobId}`)
                .expect(200);

            //Assert that the job was deleted
            expect(responseDelete.body).toEqual({
                success: true,
                message: "Job history entry deleted successfully",
            });
        });
    });

    describe("POST:/career-profiles/{career_profile_id}/qualifications", () => {
        it("Add qualification -> 201", async () => {
            //Test user with test career profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Values to be posted
            const input = {
                title: "B.Sc. Breathing",
                date: new Date("2021-01-01T00:00:00Z"),
            };

            //Act by sending the new values as post request
            const response = await request(app.getHttpServer())
                .post(`/career-profiles/${userId}/qualifications`)
                .send(input)
                .expect(201);

            //Assert that the new values are returned
            expect(response.text).toEqual("Successfully added qualification to career profile");
        });
    });

    describe("PATCH:/qualifications/{qualification_id} and DELETE", () => {
        it("Update and delete qualification -> 200", async () => {
            //Test user with test career profile
            const userId = "1";
            await dbUtils.createUserProfile(userId);
            //Values to be created
            const postInput = {
                title: "B.Sc. Breathing",
                date: new Date("2021-01-01T00:00:00Z"),
            };
            //Values to be updated to
            const updateInput = {
                title: "B.Sc. Breathing",
                date: new Date("2021-07-01T00:00:00Z"),
            };

            //Act by sending the new values as post request
            await request(app.getHttpServer())
                .post(`/career-profiles/${userId}/qualifications`)
                .send(postInput)
                .expect(201);

            //Receive the id of the created qualification
            const careerProfile = await request(app.getHttpServer())
                .get(`/career-profiles/${userId}`)
                .expect(200);
            const qualificationId = careerProfile.body.qualifications[0].id;

            //Act by sending the updated values as a patch request
            const response = await request(app.getHttpServer())
                .patch(`/qualifications/${qualificationId}`)
                .send(updateInput)
                .expect(200);

            //Assert that the request was successful
            expect(response.text).toEqual("Successfully updated qualification in career profile");
            //Assert that the values were updated
            const updatedQualification = await request(app.getHttpServer())
                .get(`/career-profiles/${userId}`)
                .expect(200);
            expect(new Date(updatedQualification.body.qualifications[0].date)).toEqual(
                updateInput.date,
            );

            //Act by sending a delete request
            const responseDelete = await request(app.getHttpServer())
                .delete(`/qualifications/${qualificationId}`)
                .expect(200);

            //Assert that the qualification was deleted
            expect(responseDelete.text).toEqual(
                "Successfully deleted qualification from career profile",
            );
        });
    });
});
