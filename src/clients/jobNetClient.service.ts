import axios from "axios";
import { PrismaService } from "../prisma/prisma.service";
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
const { JSDOM } = require("jsdom");
@Injectable()
export class JobsService {
    private CLIENT_SECRET_BERUFENET: string | undefined;
    private BASEURL_BERUFENET: string | undefined;
    private TIMEOUT_BERUFENET: number | 120000;
    private axiosConfig : any;
    constructor(private db: PrismaService) {
        db = db;
        this.CLIENT_SECRET_BERUFENET = process.env.CLIENT_SECRET_BERUFENET;
        this.BASEURL_BERUFENET = process.env.BASEURL_BERUFENET;
        this.TIMEOUT_BERUFENET = Number(   process.env.TIMEOUT_BERUFENET);
        this.axiosConfig = {
            headers: {
                "X-API-Key": this.CLIENT_SECRET_BERUFENET,
            },
            timeout: this.TIMEOUT_BERUFENET,
        };
      
    }
   

    async getJobsByID(jobId: string) {
        console.log(this.BASEURL_BERUFENET);
        console.log(this.TIMEOUT_BERUFENET)
        try {
            const response = await axios.get(`${this.BASEURL_BERUFENET}/berufe/${jobId}`, this.axiosConfig);

            return response.data;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getCompetenciesByJobID(jobId: string) {
        try {
            const response = await axios.get(`${this.BASEURL_BERUFENET}/berufe/${jobId}`, this.axiosConfig);
            const kompetenzenMatches: any = [];
            response.data.forEach((element: any) => {
                element.infofelder.forEach((element: any) => {
                    if (element.ueberschrift == "Kompetenzen") {
                        console.log(element.ueberschrift);
                        console.log(element.content);
                        const inputString = '<div data-class="abschnitt"> ... '; // Your input string

                        // Regular expression to match and extract Kompetenzen
                        const regex =
                            /<ba-berufepool-extsysref[^>]*data-idref="(\d+)"[^>]*>([^<]+)<\/ba-berufepool-extsysref>/g;

                        let match;

                        while ((match = regex.exec(element.content)) !== null) {
                            const id = match[1];
                            const name = match[2];
                            kompetenzenMatches.push({ id, name });
                        }
                    }
                });
            });

            return kompetenzenMatches;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getDigitalCompetenciesByJobID(jobId: string) {
        try {
            const response = await axios.get(`${this.BASEURL_BERUFENET}/berufe/${jobId}`, this.axiosConfig);
            let kompetenzenMatches: any = [];
            response.data.forEach((element: any) => {
                element.infofelder.forEach((element: any) => {
                    if (element.ueberschrift == "Digitalisierung") {
                        console.log(element.ueberschrift);
                        console.log(element.content);

                        const dom = new JSDOM(element.content);
                        const doc = dom.window.document;

                        const fachwortElements = doc.querySelectorAll("ba-berufepool-fachwort");
                        console.log(fachwortElements)
                        // Extract information from each element
                         kompetenzenMatches = Array.from(fachwortElements).map(
                            (element: any) => {
                                const description = element.getAttribute("description");
                                const name = element.getAttribute("name");
                                const textContent = element.textContent.trim();
                                return { description, name, textContent };
                            },
                        );

                        console.log(kompetenzenMatches);
                    }
                });
            });

            return kompetenzenMatches;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getJobsByPageAndSearchString(page: string, suchwoerter: string): Promise<any> {
        const apiKey = "d672172b-f3ef-4746-b659-227c39d95acf";
        const baseUrl = "https://rest.arbeitsagentur.de/infosysbub/bnet/pc/v1";
        const searchQuery = suchwoerter;

        const url = `${baseUrl}/berufe?suchwoerter=${searchQuery}&page=${page}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    "X-API-Key": apiKey,
                },
                timeout: 60000, // 60 seconds timeout, similar to the curl -m option
            });

            const data = response.data;
            console.log(data);
            return data;
        } catch (error) {
            console.error(`Error making API request: ${error.message}`);
        }
    }
    async getALLJobsByPage(page: string): Promise<any> {
        const url = `${this.BASEURL_BERUFENET}/berufe?suchwoerter=*&page=${page}`;

        try {
            const response = await axios.get(url, this.axiosConfig);

            return response.data;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getAllJobsBySearchString(suchwoerter: string): Promise<any[]> {
        let currentPage = 0;
        let allResults: any[] = [];

        try {
            while (true) {
                const result = await this.getJobsByPageAndSearchString(
                    currentPage.toString(),
                    suchwoerter,
                );
                // Concatenate the results of the current page to the overall results array
                allResults = allResults.concat(result._embedded.berufSucheList);
                if (!result._links.next) {
                    break;
                }
                // Increment the page number for the next iteration
                currentPage++;

                // You might want to introduce a limit to avoid infinite loops
                if (currentPage > 100) {
                    console.error("Exceeded maximum number of pages.");
                    break;
                }
            }

            return allResults;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    extractLastPageNumber(result: any): number {
        const lastHref = result._links.last.href;
        const pageMatch = lastHref.match(/page=(\d+)/);
        return pageMatch ? parseInt(pageMatch[1], 10) : 0;
    }

    async getAllJobs(): Promise<any[]> {
        try {
            let currentPage = 0;
            let allResults: any[] = [];

            const firstPageResult = await this.getALLJobsByPage("0");
            const lastPage = this.extractLastPageNumber(firstPageResult);
            const del = await this.db.beruf.deleteMany();
            await this.db.bkgr.deleteMany();
            await this.db.typ.deleteMany();
            while (currentPage <= lastPage) {
                console.log(`Fetching page ${currentPage}`);

                const result = await this.getALLJobsByPage(currentPage.toString());
                await this.storeJobsInDatabase(result._embedded.berufSucheList);
                allResults = allResults.concat(result._embedded.berufSucheList);

                // Increment the page number for the next iteration
                currentPage++;
            }
            this.db;
            return allResults;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    private async storeJobsInDatabase(jobsList: any[]): Promise<void> {
        for (const jobData of jobsList) {
            // Map the API data to your Prisma data model
            const mappedJobData = {
                id: jobData.id?.toString() || "defaultId",
                kurzBezeichnungNeutral:
                    jobData.kurzBezeichnungNeutral || "defaultKurzBezeichnung",
                bkgr: {
                    connectOrCreate: {
                        where: {
                            id: jobData.bkgr.id.toString(),
                        },
                        create: {
                            id: jobData.bkgr.id.toString(),
                            typ: {
                                connectOrCreate: {
                                    where: {
                                        id: jobData.bkgr.typ.id.toString(),
                                    },
                                    create: {
                                        id: jobData.bkgr.typ.id.toString(),
                                    },
                                },
                            },
                        },
                    },
                },
            };

            // Store the job in the database
            try {
                console.log(mappedJobData);
                await this.db.beruf.create({
                    data: mappedJobData,
                });
                console.log(`Job ${mappedJobData.id} stored successfully.`);
            } catch (error) {
                console.error(`Error storing job ${mappedJobData.id}: ${error.message}`);
                // Handle the error as needed (e.g., logging, retrying, skipping, etc.)
            }
        }
    }
}
