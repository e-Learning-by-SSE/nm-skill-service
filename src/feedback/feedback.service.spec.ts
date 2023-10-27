import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";
import { FeedbackService } from "./feedback.service";
import { FeedbackCreationDto } from "./dto/feedback-creation.dto";

describe("Feedback Service", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const feedbackService = new FeedbackService(db);

    // Wipe DB before test (only once, DB is reused between tests)
    beforeAll(async () => {    
        await dbUtils.wipeDb();
    });

    // Wipe DB after all tests are finished
    afterAll(async () => {
        await dbUtils.wipeDb();
    });

    describe("createAndRetrieveFeedbackForLearningUnit", () => {
        it("should create a feedback entry and retrieve it (single and as list)", async () => {
            // Arrange: Define test data
            const userId = "testUserId"; //Currently only a placeholder string
            const learningUnitId = "testLUId"; //Currently only a placeholder string
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

            // Act: Finally, receive a list of all feedback objects
            const retrievedEntryList = await feedbackService.loadAllFeedback();

            // Assert: Check that the list contains exactly one item
            expect(retrievedEntryList.length).toEqual(1);
        });
    });
});
