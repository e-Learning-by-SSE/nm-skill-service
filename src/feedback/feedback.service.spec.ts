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
    const feedbackService= new FeedbackService(db);

    beforeEach(async () => {
        // Wipe DB before test
        await dbUtils.wipeDb();
    });
    describe("createFeedbackForLearningUnitId", () => {

        it("should create a feedback entry with an empty optional comment", async () => {
            // Arrange: Define test data
            const userId = "testUserId"; //Currently only a placeholder string
            const learningUnitId = "testLUId"; //Currently only a placeholder string
            const feedbackCreationDto = new FeedbackCreationDto(userId,learningUnitId,1,2,3,4,5,null);  

            // Act: Call the createFeedback method
            const createdEntry = await feedbackService.createFeedback(feedbackCreationDto);

            // Assert: Check that the createdEntry is valid and matches the expected data
            expect(createdEntry.feedbackID).toBeDefined();
            // Add more assertions based on your DTO and data structure
        });

    });

   
});
