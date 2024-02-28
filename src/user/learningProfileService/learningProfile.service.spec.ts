import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningProfileService } from "./learningProfile.service";
import { LearningProfileCreationDto, LearningProfileDto } from "../dto";
import { NotFoundException } from "@nestjs/common";

describe("LearningProfileService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Object under test
    const profileService = new LearningProfileService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("createLearningProfile", () => {
        it("Create empty Learning Profile", async () => {
            // Arrange: Prepare test data
            const userProfile = await dbUtils.createUserProfile();
            const dto: LearningProfileCreationDto = {
                userId: userProfile.id,
            };

            // Test precondition: No profile entries exist
            const nProfiles = await db.learningProfile.count();
            expect(nProfiles).toEqual(0);

            // Act: Call the createLearningProfile method
            const createdLearningProfile = await profileService.createLearningProfile(dto);

            // Assert: Check the result and database state
            expect(createdLearningProfile).toBeInstanceOf(LearningProfileDto);
            expect(createdLearningProfile.userId).toEqual(userProfile.id);
        });

        it("Create learning profile for non-existing user -> NotFoundException", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user"; // An invalid user ID
            const invalidDto: LearningProfileCreationDto = {
                userId: invalidUserId,
            };

            // Act and Assert: Call the createLearningProfile method and expect it to throw an error
            await expect(profileService.createLearningProfile(invalidDto)).rejects.toThrowError(
                NotFoundException,
            );
        });
    });
});
