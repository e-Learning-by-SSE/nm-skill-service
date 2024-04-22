import { BerufeService } from "./berufeNetClient.service"; // Adjust the path accordingly
import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";

describe("JobsService", () => {
    const apiKey = "d672172b-f3ef-4746-b659-227c39d95acf";

    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const jobService = new BerufeService(db, config);

    beforeEach(() => {});

    it("should make a successful API request", async () => {
        const result = await jobService.getJobsByPageAndSearchString("1", "Test");

        // Access the parsed data
        const jobSearchList = result._embedded.berufSucheList;
        console.log(jobSearchList);
    });
    /*
    it("should make a successful API request", async () => {
      await jobService.getAllJobs().then((results) => {
            console.log(results);
        });
    });*/
});
