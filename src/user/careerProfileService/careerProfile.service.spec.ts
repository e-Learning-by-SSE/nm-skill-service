import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { CareerProfileService } from "./careerProfile.service";
import { UserCreationDto, QualificationDto } from "../dto";

describe("CareerProfileService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const careerService = new CareerProfileService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("createQualificationForCareerProfile", () => {
        it("should create a new qualification for a user", async () => {
            // Arrange: Prepare test data
            const userId = "123";

            await dbUtils.wipeDb();
            const comp = await db.company.create({
                data: {
                    name: "Firma1",
                },
            });

            const user: UserCreationDto = { companyId: comp.id, name: "Name123", id: userId };
            await db.userProfile.create({
                data: { id: user.id, name: user.name, companyId: user.companyId },
            });
            const qualificationDto: QualificationDto = {
                name: "Bachelor of Science",
                year: 2020,
                userCareerProfileId: "123",
                id: "123",
            };

            // Act: Call the createQualificationForCareerProfile method
            const createdQualification = await careerService.createQualificationForCareerProfile(
                userId,
                qualificationDto,
            );

            // Assert: Check the result and database state
            expect(createdQualification).toBeInstanceOf(QualificationDto);
            expect(createdQualification.name).toEqual(qualificationDto.name);
            expect(createdQualification.year).toEqual(qualificationDto.year);

            // Check the database state to ensure the qualification is created
            const userQualifications = await db.qualification.findMany({
                where: {
                    careerProfileId: userId,
                },
            });
            expect(userQualifications).toHaveLength(1);
            expect(userQualifications[0].name).toEqual(qualificationDto.name);
            expect(userQualifications[0].year).toEqual(qualificationDto.year);
        });

        it("should handle errors when creating a qualification", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user";
            const qualificationDto: QualificationDto = {
                name: "Bachelor of Science",
                year: 2020,
                userCareerProfileId: "123",
                id: "123",
            };

            // Act and Assert: Call the createQualificationForCareerProfile method and expect it to throw an error
            await expect(
                careerService.createQualificationForCareerProfile(invalidUserId, qualificationDto),
            ).rejects.toThrowError(BadRequestException);
        });
    });

    describe("deleteQualificationForCareerProfile", () => {
        it("should delete a qualification for a user", async () => {
            // Arrange: Prepare test data
            const userId = "123";

            await dbUtils.wipeDb();
            const comp = await db.company.create({
                data: {
                    name: "Firma1",
                },
            });

            const user: UserCreationDto = { companyId: comp.id, name: "Name123", id: userId };
            await db.userProfile.create({
                data: { id: user.id, name: user.name, companyId: user.companyId },
            });

            const qualificationDto: QualificationDto = {
                name: "Bachelor of Science",
                year: 2020,
                userCareerProfileId: "123",
                id: "123",
            };

            const createdQualification = await careerService.createQualificationForCareerProfile(
                userId,
                qualificationDto,
            );

            // Act: Call the deleteQualificationForCareerProfile method
            const deletedQualification = await careerService.deleteQualificationForCareerProfile(
                userId,
                createdQualification.id,
            );

            // Assert: Check the result and database state
            expect(deletedQualification).toBeInstanceOf(QualificationDto);
            expect(deletedQualification.id).toEqual(createdQualification.id);

            // Check the database state to ensure the qualification is deleted
            const userQualifications = await db.qualification.findMany({
                where: {
                    careerProfileId: userId,
                },
            });
            expect(userQualifications).toHaveLength(0);
        });
    });
});
