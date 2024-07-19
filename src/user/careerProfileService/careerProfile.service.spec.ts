import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { CareerProfileService } from "./careerProfile.service";
import { UserCreationDto, QualificationDto } from "../dto";
import { UserMgmtService } from "../user.service";

describe("CareerProfileService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const userService = new UserMgmtService(db);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const careerService = new CareerProfileService(db);

    beforeAll(async () => {
        // Wipe DB before all tests (as we reuse date)
        await dbUtils.wipeDb();
    });

    afterAll(async () => {
        // Wipe DB after all tests
        await dbUtils.wipeDb();
        await db.$disconnect();
    });

    describe("createGetAndUpdateASimpleCareerProfile", () => {
        //Reused test data
        const userId = "TestUser1";
        it("should create a new (empty) career profile for a user", async () => {
            // Arrange: Prepare test data
            const user: UserCreationDto = { id: userId };
            await userService.createUser(user);

            // Assert: Check that a career profile with the id of the user profile exists and has default values
            const careerProfile = await careerService.getCareerProfileByID(userId);
            expect(careerProfile.id).toEqual(userId);
            expect(careerProfile.jobHistory).toHaveLength(0);
            expect(careerProfile.qualifications).toHaveLength(0);
            expect(careerProfile.professionalInterests).toHaveLength(0);
            expect(careerProfile.selfReportedSkills).toHaveLength(0);
        });

        it("should update an existing career profile for a user", async () => {
            // Act: Update the career profile
            let updatedCareerProfile = await careerService.patchCareerProfileByID(userId, {
                professionalInterests: ["AI", "ML"],
            });

            // Assert: Check that the return values are correct
            expect(updatedCareerProfile.professionalInterests).toEqual(["AI", "ML"]);

            // Act: Update the career profile again
            updatedCareerProfile = await careerService.patchCareerProfileByID(userId, {
                professionalInterests: ["AI", "ML", "SE"],
                selfReportedSkills: ["Python", "Java"],
            });

            // Assert: Check that the return values are correct again
            expect(updatedCareerProfile.professionalInterests).toEqual(["AI", "ML", "SE"]);
            expect(updatedCareerProfile.selfReportedSkills).toEqual(["Python", "Java"]);

            // Act: Now get the updated career profile from the database
            const updatedCareerProfileFromDB = await careerService.getCareerProfileByID(userId);

            // Assert: Check that the career profile has been updated
            expect(updatedCareerProfileFromDB.id).toEqual(userId);
            expect(updatedCareerProfileFromDB.jobHistory).toHaveLength(0);
            expect(updatedCareerProfileFromDB.qualifications).toHaveLength(0);
            expect(updatedCareerProfileFromDB.professionalInterests).toEqual(["AI", "ML", "SE"]);
            expect(updatedCareerProfileFromDB.selfReportedSkills).toEqual(["Python", "Java"]);
        });

        it("should handle errors when updating a non-existing career profile", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";

            // Act and Assert: Call the patchCareerProfileByID method and expect it to throw an error
            await expect(
                careerService.patchCareerProfileByID(invalidUserId, {
                    professionalInterests: ["AI", "ML"],
                }),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should handle errors when getting a non-existing career profile", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";

            // Act and Assert: Call the getCareerProfileByID method and expect it to throw an error
            await expect(careerService.getCareerProfileByID(invalidUserId)).rejects.toThrowError(
                NotFoundException,
            );
        });

        it("should create and return several career profiles", async () => {
            // Arrange: Prepare test data
            const user1: UserCreationDto = { id: "user1" };
            const user2: UserCreationDto = { id: "user2" };
            await userService.createUser(user1);
            await userService.createUser(user2);

            // Act: Get all career profiles
            const careerProfiles = await careerService.getAllCareerProfiles();

            // Assert: Check that both career profiles are returned
            expect(careerProfiles).toHaveLength(3);
            expect(careerProfiles[0].id).toEqual(userId); //Created in the first test
            expect(careerProfiles[1].id).toEqual("user1");
            expect(careerProfiles[2].id).toEqual("user2");
        });
    });

    describe("createAndUpdateJobForCareerProfile", () => {
        //Test data reused across the test cases
        const userId = "TestUser2";
        const jobId = "TestJob1";
        it("should create an empty job history for a user", async () => {
            // Arrange: Prepare test data
            const user: UserCreationDto = { id: userId };
            await userService.createUser(user);

            // Assert: Check that the job history is empty and existing
            const careerProfile = await careerService.getCareerProfileByID(userId);
            expect(careerProfile.jobHistory).toHaveLength(0);
        });

        it("should create a new job for a user", async () => {
            // Arrange: Prepare test data
            const jobDto = {
                id: jobId,
                jobTitle: "Software Developer",
                startDate: new Date("2020"),
                company: "TestCompany",
            };

            // Act: Call the addJobToJobHistoryAtCareerProfile method
            await careerService.addJobToJobHistoryAtCareerProfile(userId, jobDto);

            // Get the user's job history from the database
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const jobHistory = careerProfile.jobHistory;

            expect(jobHistory).toHaveLength(1);
            const job = jobHistory[0];
            expect(job.jobTitle).toEqual(jobDto.jobTitle);
            expect(job.startDate).toEqual(jobDto.startDate);
            expect(job.company).toEqual(jobDto.company);
            expect(job.endDate).toBeUndefined(); //End date should be undefined
            expect(job.id).toEqual(jobDto.id);
        });

        it("should update an existing job for a user", async () => {
            // Arrange: Prepare test data
            const updatedJobDto = {
                id: jobId,
                jobTitle: "Software Developer",
                startDate: new Date("2020"),
                endDate: new Date("2021"),
                company: "TestCompany",
            };
            // Act: Update the job
            await careerService.updateJobInCareerProfile(updatedJobDto.id, updatedJobDto);

            // Get the user's job history from the database
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const jobHistory = careerProfile.jobHistory;

            // Assert: Check that the job has been updated
            expect(jobHistory).toHaveLength(1);
            const job = jobHistory[0];
            expect(job.jobTitle).toEqual(updatedJobDto.jobTitle);
            expect(job.startDate).toEqual(updatedJobDto.startDate);
            expect(job.endDate).toEqual(updatedJobDto.endDate);
            expect(job.company).toEqual(updatedJobDto.company);
        });

        it("should handle errors when updating a non-existing job", async () => {
            // Arrange: Prepare invalid test data
            const updatedJobDto = {
                id: "non-existent-job",
                jobTitle: "123",
                startDate: new Date("2020"),
                company: "TestCompany",
            };

            // Act and Assert: Call the updateJobInCareerProfile method and expect it to throw an error
            await expect(
                careerService.updateJobInCareerProfile(updatedJobDto.id, updatedJobDto),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should handle errors when adding a job to a non-existing career profile", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";
            const jobDto = {
                id: "TestJob2",
                jobTitle: "Software Developer",
                startDate: new Date("2020"),
                company: "TestCompany",
            };

            // Act and Assert: Call the addJobToJobHistoryAtCareerProfile method and expect it to throw an error
            await expect(
                careerService.addJobToJobHistoryAtCareerProfile(invalidUserId, jobDto),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should delete a job for a user", async () => {
            // Act: Delete the job created in the first test
            await careerService.deleteJobFromHistoryInCareerProfile(jobId);

            // Get the user's job history from the database
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const jobHistory = careerProfile.jobHistory;

            expect(jobHistory).toHaveLength(0);
        });

        it("should throw an error when deleting a non-existing job", async () => {
            // Arrange: Prepare invalid test data
            const invalidJobId = "non-existent-job";

            // Act and Assert: Call the deleteJobFromHistoryInCareerProfile method and expect it to throw an error
            await expect(
                careerService.deleteJobFromHistoryInCareerProfile(invalidJobId),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should add several jobs to a user's job history and return them ascending by start date", async () => {
            // Arrange: Prepare test data
            const jobDto1 = {
                id: "TestJob2",
                jobTitle: "Software Developer",
                startDate: new Date("1999"),
                company: "TestCompany2",
            };
            const jobDto2 = {
                id: "TestJob3",
                jobTitle: "Software Developer",
                startDate: new Date("1995"),
                company: "TestCompany3",
            };
            const jobDto3 = {
                id: "TestJob4",
                jobTitle: "Software Developer",
                startDate: new Date("2011"),
                company: "TestCompany4",
            };

            // Act: Add the jobs to the user's job history
            await careerService.addJobToJobHistoryAtCareerProfile(userId, jobDto1);
            await careerService.addJobToJobHistoryAtCareerProfile(userId, jobDto2);
            await careerService.addJobToJobHistoryAtCareerProfile(userId, jobDto3);

            // Get the user's job history from the database
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const jobHistory = careerProfile.jobHistory;

            // Assert: Check that the jobs have been added and are sorted by start date
            expect(jobHistory).toHaveLength(3);
            expect(jobHistory[0]).toEqual(jobDto2);
            expect(jobHistory[1]).toEqual(jobDto1);
            expect(jobHistory[2]).toEqual(jobDto3);
        });
    });

    describe("createUpdateAndDeleteQualificationForCareerProfile", () => {
        const userId = "TestUser3";
        const qualificationId = "TestQualification1";

        it("should create an empty qualification list for a newly created user", async () => {
            // Arrange: Prepare test data
            const user: UserCreationDto = { id: userId };
            await userService.createUser(user);

            // Assert: Check that the qualification list is empty and existing
            const careerProfile = await careerService.getCareerProfileByID(userId);
            expect(careerProfile.qualifications).toHaveLength(0);
        });

        it("should create a new qualification for a user", async () => {
            // Arrange: Prepare test data
            const qualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2020"),
                id: qualificationId,
            };

            // Act: Create and add the qualification to the career profile
            await careerService.addQualificationToCareerProfile(userId, qualificationDto);

            // Get the updated career profile from the DB and its qualifications
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const userQualifications = careerProfile.qualifications;

            // Assert: Check that the qualification has been added
            expect(userQualifications).toHaveLength(1);
            expect(userQualifications[0].title).toEqual(qualificationDto.title);
            expect(userQualifications[0].date).toEqual(qualificationDto.date);
        });

        it("should update an existing qualification for a user", async () => {
            // Arrange: Prepare test data
            const updatedQualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2021"),
                id: qualificationId,
            };

            // Act: Update the qualification
            await careerService.updateQualificationInCareerProfile(
                qualificationId,
                updatedQualificationDto,
            );

            // Get the updated career profile from the DB and its qualifications
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const userQualifications = careerProfile.qualifications;

            // Assert: Check that the qualification has been updated
            expect(userQualifications).toHaveLength(1);
            expect(userQualifications[0].title).toEqual(updatedQualificationDto.title);
            expect(userQualifications[0].date).toEqual(updatedQualificationDto.date);
        });

        it("should handle errors when updating a non-existing qualification", async () => {
            // Arrange: Prepare invalid test data
            const updatedQualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2021"),
                id: "non-existent-qualification",
            };

            // Act and Assert: Call the updateQualificationInCareerProfile method and expect it to throw an error
            await expect(
                careerService.updateQualificationInCareerProfile(
                    updatedQualificationDto.id!,
                    updatedQualificationDto,
                ),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should handle errors when creating a qualification for a non-existing user", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";
            const qualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2020"),
                id: "does not matter",
            };

            // Act and Assert: Call the createQualificationForCareerProfile method and expect it to throw an error
            await expect(
                careerService.addQualificationToCareerProfile(invalidUserId, qualificationDto),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should delete a qualification for a user", async () => {
            // Act: Delete the qualification created in the first test
            await careerService.deleteQualificationFromCareerProfile(qualificationId);

            // Try to get the qualification from the Database
            const userQualifications = (await careerService.getCareerProfileByID(userId))
                .qualifications;
            // Assert: Check that the qualification has been deleted
            expect(userQualifications).toHaveLength(0);
        });

        it("should throw an error when deleting a non-existing qualification", async () => {
            // Arrange: Prepare invalid test data
            const invalidQualificationId = "non-existent-qualification";

            // Act and Assert: Call the deleteQualificationFromCareerProfile method and expect it to throw an error
            await expect(
                careerService.deleteQualificationFromCareerProfile(invalidQualificationId),
            ).rejects.toThrowError(ForbiddenException);
        });

        it("should add several qualifications to a user's qualifications and return them ascending by date", async () => {
            // Arrange: Prepare test data
            const qualificationDto1: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("1999"),
                id: "TestQualification2",
            };
            const qualificationDto2: QualificationDto = {
                title: "Master of Science",
                date: new Date("1995"),
                id: "TestQualification3",
            };
            const qualificationDto3: QualificationDto = {
                title: "PhD",
                date: new Date("2011"),
                id: "TestQualification4",
            };

            // Act: Add the qualifications to the user's qualifications
            await careerService.addQualificationToCareerProfile(userId, qualificationDto1);
            await careerService.addQualificationToCareerProfile(userId, qualificationDto2);
            await careerService.addQualificationToCareerProfile(userId, qualificationDto3);

            // Get the updated career profile from the DB and its qualifications
            const careerProfile = await careerService.getCareerProfileByID(userId);
            const userQualifications = careerProfile.qualifications;

            // Assert: Check that the qualifications have been added and are sorted by date
            expect(userQualifications).toHaveLength(3);
            expect(userQualifications[0]).toEqual(qualificationDto2);
            expect(userQualifications[1]).toEqual(qualificationDto1);
            expect(userQualifications[2]).toEqual(qualificationDto3);
        });
    });
});
