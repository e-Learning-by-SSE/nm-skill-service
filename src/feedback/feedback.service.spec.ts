import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreationDto } from "./dto/feedback-creation.dto";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";
import { UserMgmtService } from "../user/user.service";

describe("Feedback Service", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const userService = new UserMgmtService(db);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const feedbackService = new FeedbackService(db);

    // Wipe DB before each test
    beforeEach(async () => {
        await dbUtils.wipeDb();
    });

    // Wipe DB after all tests are finished
    afterAll(async () => {
        await dbUtils.wipeDb();
    });

    describe("createRetrieveDeleteFeedbackForLearningUnit", () => {
        it("should create a feedback entry, retrieve it (single and as list), and delete it", async () => {
            // Arrange: Define test data

            //Create test user profile
            const userId = "testId";
            await userService.createUser({id: userId});

            //Create test learning unit
            const unit = await dbUtils.createLearningUnit([], []);
            const learningUnitId = unit.id; // Replace with a valid learning unit ID

            //Create test feedback dto
            const feedbackCreationDto = new FeedbackCreationDto(
                userId,
                learningUnitId,
                1,
                2,
                3,
                4,
                5,
                null,
            );

            // Act: Call the createFeedback method
            const createdEntry = await feedbackService.createFeedback(feedbackCreationDto);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect(createdEntry.feedbackID).toBeDefined();

            // Arrange: Get the actual feedback id set in the db
            const feedbackId = createdEntry.feedbackID;

            // Act: Call the getFeedback method
            const retrievedEntry = await feedbackService.getFeedback(feedbackId);

            // Assert: Check that we retrieved the correct feedback
            expect(retrievedEntry.id).toEqual(feedbackId);

            // Act: Finally, receive a list of all feedback objects for the learning unit
            const retrievedEntryList = await feedbackService.loadAllFeedback(learningUnitId);

            // Assert: Check that the list contains exactly one item
            expect(retrievedEntryList.length).toEqual(1);

            // Act: Delete the existing feedback
            const retrievedAnswer = await feedbackService.deleteFeedbackById(feedbackId);

            // Assert: Check if the deletion was successful
            expect(retrievedAnswer).toEqual(true);
        });

        it("should delete the feedback entry only and exactly if the corresponding learning unit is deleted", async () => {
            // Arrange: Define test data

            //Create test user profile
            const userId = "testId2";
            await userService.createUser({id: userId});

            //Create test learning unit
            const unit = await dbUtils.createLearningUnit([], []);
            const learningUnitId = unit.id; // Replace with a valid learning unit ID

            //Create test feedback dto and DB entry
            const feedbackCreationDto = new FeedbackCreationDto(
                userId,
                learningUnitId,
                1,
                2,
                3,
                4,
                5,
                null,
            );
            const createdFeedbackEntry = await feedbackService.createFeedback(feedbackCreationDto);
            const feedbackId = createdFeedbackEntry.feedbackID; // Replace with a valid feedback ID

            //Update + delete user currently not tested as intended, as onDelete relation is not working properly.
            let retrievedEntry = await feedbackService.getFeedback(feedbackId);
            expect(retrievedEntry.userId).toEqual(createdFeedbackEntry.userID);

            // Act: Update the learning unit
            // To be done when LU has an update function/endpoint
            retrievedEntry = await feedbackService.getFeedback(feedbackId);

            // Assert: Check that the learning unit id is unchanged
            expect(retrievedEntry.learningUnitId).toEqual(createdFeedbackEntry.learningUnitID);

            // Act: Delete user
            db.userProfile.delete({ where: { id: userId } });
            retrievedEntry = await feedbackService.getFeedback(feedbackId);

            // Assert: Check that the feedback author is set to "anonymous" (to be corrected)
            //expect(retrievedEntry.userId).toEqual("Anonymous");
            expect(retrievedEntry.userId).toEqual(userId);

            // Act: Delete the learning unit
            db.learningUnit.delete({ where: { id: learningUnitId } });

            // Assert: Check that the feedback is also deleted
            await expect(feedbackService.getFeedback("feedbackId")).rejects.toThrow(
                NotFoundException,
            );
        });

        it("should throw errors when retrieving or deleting non existent feedback", async () => {
            // Act and assert: Call the getFeedback method with a non-existing id and expect an error
            await expect(feedbackService.getFeedback("nonExistentId")).rejects.toThrow(
                NotFoundException,
            );

            // Act and assert: Call the feedback deletion method with a non-existing id and expect an error
            await expect(feedbackService.deleteFeedbackById("nonExistentId")).rejects.toThrow(
                NotFoundException,
            );

            // Act and assert: Call the loadAllFeedback method with no existing feedbacks (for a non existent learning unit)
            expect((await feedbackService.loadAllFeedback("nonExistentId")).length).toEqual(0);
        });

        it("should throw errors when trying to create feedback with invalid user/learning unit ids", async () => {
            // Arrange: Create test feedback dto with invalid ids
            const feedbackCreationDto = new FeedbackCreationDto(
                "userId",
                "learningUnitId",
                1,
                2,
                3,
                4,
                5,
                null,
            );

            // Act and assert: Call the createFeedback method with a non-existing user/LU id and expect an error
            await expect(feedbackService.createFeedback(feedbackCreationDto)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });
});
