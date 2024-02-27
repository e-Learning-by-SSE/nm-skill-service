import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../../DbTestUtils";
import { PrismaService } from "../../prisma/prisma.service";
import { LearningHistoryService } from "./learningHistory.service";
import { LearningHistoryCreationDto, LearningHistoryDto } from "../dto";
import { NotFoundException } from "@nestjs/common";

describe("CareerProfileService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Object under test
    const historyService = new LearningHistoryService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });

    describe("createLearningHistory", () => {
        it("Create empty Learning History", async () => {
            // Arrange: Prepare test data
            const userProfile = await dbUtils.createUserProfile();
            const dto: LearningHistoryCreationDto = {
                userId: userProfile.id,
            };

            // Test precondition: No history entries exist
            const nHistories = await db.learningHistory.count();
            expect(nHistories).toEqual(0);

            // Act: Call the createLearningHistory method
            const createdLearningHistory = await historyService.createLearningHistory(dto);

            // Assert: Check the result and database state
            expect(createdLearningHistory).toBeInstanceOf(LearningHistoryDto);
            expect(createdLearningHistory.userId).toEqual(userProfile.id);
        });

        it("Create history profile for non-existing user -> NotFoundException", async () => {
            // Arrange: Prepare invalid test data
            const invalidUserId = "non-existent-user"; // An invalid user ID
            const invalidDto: LearningHistoryCreationDto = {
                userId: invalidUserId,
            };

            // Act and Assert: Call the createLearningHistory method and expect it to throw an error
            await expect(historyService.createLearningHistory(invalidDto)).rejects.toThrowError(
                NotFoundException,
            );
        });
    });
});
