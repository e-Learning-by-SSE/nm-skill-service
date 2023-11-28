import axios from "axios";
import { BerufeService } from "./berufeNetClient.service"; // Adjust the path accordingly
import { ConfigService } from "@nestjs/config";
import { DbTestUtils } from "../DbTestUtils";
import { PrismaService } from "../prisma/prisma.service";

describe("BerufeService", () => {
    const apiKey = "d672172b-f3ef-4746-b659-227c39d95acf";
    
    const config = new ConfigService();
    const db = new PrismaService(config);
    const dbUtils = DbTestUtils.getInstance();

    // Test object
    const berufeService = new BerufeService(db);

    beforeEach(() => {
        
    });

   it("should make a successful API request", async () => {
        const result = await berufeService.getBerufeByPageAndSearchString("1", "Test");
      
        // Access the parsed data
        const berufSucheList = result._embedded.berufSucheList;
        console.log(berufSucheList);
    });
/*
    it("should make a successful API request", async () => {
      await berufeService.getAllBerufe().then((results) => {
            console.log(results);
        });
    });*/
});
