import { BerufeService } from "./berufeNetClient.service"; // Adjust the path accordingly
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

describe("JobsService", () => {
    const config = new ConfigService();
    const db = new PrismaService(config);

    // Test object
    const jobService = new BerufeService(db, config);

    beforeEach(() => {});

    it("should make a successful API request", async () => {
        const result = await jobService.getJobsByPageAndSearchString("0", "Test");

        // Access the parsed data
        const jobSearchList = result._embedded.berufSucheList as any[] as {
            id: number;
            kurzBezeichnungNeutral: string;
            bkgr: { id: number; typ: Object };
        }[];
        expect(jobSearchList).toBeDefined();
        expect(jobSearchList.length).toBeGreaterThan(0);

        // Test for a random job: Ethical Hacker
        const job = jobSearchList.find((job) => job.id === 133432);
        expect(job).toBeDefined();
        expect(job!.kurzBezeichnungNeutral).toBe("Ethical Hacker");
    });
});
