import axios from "axios";
import { BerufeService } from "./berufeNetClient.service"; // Adjust the path accordingly

describe("BerufeService", () => {
    const apiKey = "d672172b-f3ef-4746-b659-227c39d95acf";
    let berufeService: BerufeService;

    beforeEach(() => {
        berufeService = new BerufeService(apiKey);
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
