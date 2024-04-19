import { BadRequestException } from "@nestjs/common";
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
    // Reused for tests
    const userId = "123";
    const qualificationId = "321";

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

    describe("createAndDeleteQualificationForCareerProfile", () => {
        it("should create a new qualification for a user", async () => {
            // Arrange: Prepare test data
            const user: UserCreationDto = { id: userId };
            await userService.createUser(user);

            const qualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2020"),
                careerProfileId: userId, //Same as user id
                id: qualificationId, 
            };

            // Act: Call the createQualificationForCareerProfile method
            const createdQualification = await careerService.createQualificationForCareerProfile(
                qualificationDto,
            );

            // Assert: Check the result and database state
            expect(createdQualification.title).toEqual(qualificationDto.title);
            expect(createdQualification.date).toEqual(qualificationDto.date);

            // Check the database state to ensure the qualification is created
            let userQualifications = await db.qualification.findMany({
                where: {
                    careerProfileId: userId,
                    id: qualificationId,
                },
            });
            expect(userQualifications).toHaveLength(1);
            expect(userQualifications[0].title).toEqual(qualificationDto.title);
            expect(userQualifications[0].date).toEqual(qualificationDto.date);

            // Act: Call the deleteQualificationForCareerProfile method
            await careerService.deleteQualificationForCareerProfile(qualificationId);

            // Check the database state to ensure the qualification is deleted
            userQualifications = await db.qualification.findMany({
                where: {
                    careerProfileId: userId,
                    id: qualificationId,
                },
            });
            expect(userQualifications).toHaveLength(0);
        });

        it("should handle errors when creating a qualification for a non-existing user", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";
            // Do not create a user
            const qualificationDto: QualificationDto = {
                title: "Bachelor of Science",
                date: new Date("2020"),
                careerProfileId: invalidUserId,
                id: "does not matter",
            };

            // Act and Assert: Call the createQualificationForCareerProfile method and expect it to throw an error
            await expect(
                careerService.createQualificationForCareerProfile(qualificationDto),
            ).rejects.toThrowError(BadRequestException);
        });
    });

});
