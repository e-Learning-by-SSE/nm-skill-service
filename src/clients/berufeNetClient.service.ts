import axios, { AxiosRequestConfig } from "axios";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const { JSDOM } = require("jsdom");

@Injectable()
export class BerufeService {
    private baseUrl: string;
    private axiosConfig: AxiosRequestConfig;

    constructor(private db: PrismaService, config: ConfigService) {
        this.baseUrl = config.get("BERUFENET_BASEURL") ?? "https://api.berufenet.arbeitsagentur.de";
        this.axiosConfig = {
            headers: {
                "X-API-Key": config.get("BERUFENET_CLIENT_SECRET"),
            },
            timeout: config.get("BERUFENET_TIMEOUT"),
        };
    }

    async getJobsByID(jobId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/berufe/${jobId}`, this.axiosConfig);

            return response.data;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getCompetenciesByJobID(jobId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/berufe/${jobId}`, this.axiosConfig);
            const competenceMatches: any = [];
            response.data.forEach((element: any) => {
                element.infofelder.forEach((element: any) => {
                    if (element.ueberschrift == "Kompetenzen") {
                        // console.log(element.ueberschrift);
                        // console.log(element.content);

                        // Regular expression to match and extract competences
                        const regex =
                            /<ba-berufepool-extsysref[^>]*data-idref="(\d+)"[^>]*>([^<]+)<\/ba-berufepool-extsysref>/g;

                        let match;

                        while ((match = regex.exec(element.content)) !== null) {
                            const id = match[1];
                            const name = match[2];
                            competenceMatches.push({ id, name });
                        }
                    }
                });
            });

            return competenceMatches;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getDigitalCompetenciesByJobID(jobId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/berufe/${jobId}`, this.axiosConfig);
            let competenceMatches: any = [];
            response.data.forEach((element: any) => {
                element.infofelder.forEach((element: any) => {
                    if (element.ueberschrift == "Digitalisierung") {
                        // console.log(element.ueberschrift);
                        // console.log(element.content);

                        const dom = new JSDOM(element.content);
                        const doc = dom.window.document;

                        const fachwortElements = doc.querySelectorAll("ba-berufepool-fachwort");
                        console.log(fachwortElements);
                        // Extract information from each element
                        competenceMatches = Array.from(fachwortElements).map((element: any) => {
                            const description = element.getAttribute("description");
                            const name = element.getAttribute("name");
                            const textContent = element.textContent.trim();
                            return { description, name, textContent };
                        });

                        console.log(competenceMatches);
                    }
                });
            });

            return competenceMatches;
        } catch (error) {
            throw new Error(`Error making API request: ${error.message}`);
        }
    }

    async getJobsByPageAndSearchString(page: string, searchQuery: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/berufe?suchwoerter=${searchQuery}&page=${page}`,
                this.axiosConfig,
            );

            return response.data;
        } catch (error) {
            console.error(`Error making API request: ${error.message}`);
        }
    }

    async getALLJobsByPage(page: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/berufe?suchwoerter=*&page=${page}`,
                this.axiosConfig,
            );

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
            await this.db.berufeNetJob.deleteMany();
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
                kurzBezeichnungNeutral: jobData.kurzBezeichnungNeutral || "defaultKurzBezeichnung",
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
                await this.db.berufeNetJob.create({
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
